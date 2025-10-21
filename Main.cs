using System.Reflection;
using System.Text.Json.Serialization;
using SPTarkov.DI.Annotations;
using SPTarkov.Server.Core.DI;
using SPTarkov.Server.Core.Helpers;
using SPTarkov.Server.Core.Models.Common;
using SPTarkov.Server.Core.Models.Eft.Common.Tables;
using SPTarkov.Server.Core.Models.Spt.Mod;
using SPTarkov.Server.Core.Models.Utils;
using SPTarkov.Server.Core.Services;
using SPTarkov.Server.Core.Utils;
using Path = System.IO.Path;
using Reward = SPTarkov.Server.Core.Models.Eft.Common.Tables.Reward;

namespace GunsmithTweaks;

public record ModMetadata : AbstractModMetadata
{
    public override string ModGuid { get; init; } = "com.rukiragaming.gunsmithtweaks";
    public override string Name { get; init; } = "GunsmithTweaks";
    public override string Author { get; init; } = "Ru_Kira";
    public override List<string>? Contributors { get; init; }
    public override SemanticVersioning.Version Version { get; init; } = new("2.0.0");
    public override SemanticVersioning.Range SptVersion { get; init; } = new("~4.0.0");
    public override List<string>? Incompatibilities { get; init; }
    public override Dictionary<string, SemanticVersioning.Range>? ModDependencies { get; init; }
    public override string? Url { get; init; }
    public override bool? IsBundleMod { get; init; }
    public override string? License { get; init; } = "MIT";
}

public sealed class Description
{
    [JsonPropertyName("description")] public string? Desc { get; set; }
}

[Injectable(TypePriority = OnLoadOrder.PostDBModLoader + 1)]
public class Main(
    ISptLogger<Main> logger,
    DatabaseService databaseService,
    ItemHelper itemHelper,
    JsonUtil json,
    ModHelper modHelper
) : IOnLoad
{
    private ModConfig? _modConfig;

    private Dictionary<MongoId, Quest> _quests = [];
    private HashSet<MongoId> _editableSet = [];

    private string _defaultPath = "", _loreAccuratePath = "", _descriptionsPath = "";
    private int _defaultRewardsAdded, _defaultQuestsTouched, _loreRewardsAdded, _loreQuestsTouched, _descUpdated;

    private static readonly IReadOnlyList<MongoId>
        _gunsmithQuest = // Sorry Acid, borrowing this for the time being - I technically had something similar already setup, just wasn't ready to use it...
        [
            "5ac23c6186f7741247042bad", // Gunsmith 1
            "5ac2426c86f774138762edfe", // Gunsmith 2
            "5ac2428686f77412450b42bf", // Gunsmith 3
            "639872f9decada40426d3447", // Gunsmith 4
            "5ae3267986f7742a413592fe", // Gunsmith 5
            "5ae3270f86f77445ba41d4dd", // Gunsmith 6
            "5ac244eb86f7741356335af1", // Gunsmith 7
            "5ae3277186f7745973054106", // Gunsmith 8
            "639872fa9b4fb827b200d8e5", // Gunsmith 9
            "5ae327c886f7745c7b3f2f3f", // Gunsmith 10
            "639872fc93ae507d5858c3a6", // Gunsmith 11
            "5b47799d86f7746c5d6a5fd8", // Gunsmith 12
            "5ac244c486f77413e12cf945", // Gunsmith 13
            "639872fe8871e1272b10ccf6", // Gunsmith 14
            "5ae3280386f7742a41359364", // Gunsmith 15
            "5ac242ab86f77412464f68b4", // Gunsmith 16
            "5b47749f86f7746c5d6a5fd4", // Gunsmith 17
            "5b477b6f86f7747290681823", // Gunsmith 18
            "639873003693c63d86328f25", // Gunsmith 19
            "5b477f7686f7744d1b23c4d2", // Gunsmith 20
            "63987301e11ec11ff5504036", // Gunsmith 21
            "5b47825886f77468074618d3", // Gunsmith 22
            "64f83bb69878a0569d6ecfbe", // Gunsmith 23
            "64f83bcdde58fc437700d8fa", // Gunsmith 24
            "64f83bd983cfca080a362c82" // Gunsmith 25
        ];

    public async Task OnLoad()
    {
        logger.Info("[Gunsmith Tweaks] Applying Gunsmith tweaks…");

        var pathToMod = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location)!;

        _modConfig = modHelper.GetJsonDataFromFile<ModConfig>(pathToMod, "config/config.json");

        _defaultPath = Path.Combine(pathToMod, "db", "Default.json");
        _loreAccuratePath = Path.Combine(pathToMod, "db", "LoreAccurate.json");
        _descriptionsPath = Path.Combine(pathToMod, "db", "Descriptions.json");

        _quests = databaseService.GetQuests();
        _editableSet = new HashSet<MongoId>(_gunsmithQuest);

        if (_modConfig.DefaultRewards)
        {
            await DefaultRewards();
            if (_modConfig.LoreAccurate)
            {
                await LoreAccurateRewards();
                await DescriptionRewards();
            }
            else
            {
                if (_modConfig.DebugLogging) logger.Info("[Gunsmith Tweaks] Lore Accurate disabled");
            }
        }
        else
        {
            if (_modConfig.DebugLogging) logger.Info("[Gunsmith Tweaks] Mod Disabled");
        }

        if (!_modConfig.DebugLogging) return;

        if (_modConfig.DefaultRewards)
            logger.Info(
                $"[Gunsmith Tweaks] Default: applied {_defaultRewardsAdded} rewards to {_defaultQuestsTouched} quests.");
        if (_modConfig.LoreAccurate) logger.Info(
                $"[Gunsmith Tweaks] LoreAccurate: applied {_loreRewardsAdded} rewards to {_loreQuestsTouched} quests.");
        if (_modConfig.LoreAccurate) logger.Info(
                $"[Gunsmith Tweaks] Descriptions: updated {_descUpdated} quests.");

        return;
    }

    private async Task DefaultRewards()
    {
        var defaultsDict = await json.DeserializeFromFileAsync<Dictionary<string, List<Reward>>>(_defaultPath)
                           ?? throw new NullReferenceException("Could not deserialize default rewards!");

        foreach (var (questKey, rewards) in defaultsDict)
        {
            if (string.IsNullOrWhiteSpace(questKey)) continue;
            
            if (rewards.Count == 0) continue;

            if (!MongoId.IsValidMongoId(questKey)) continue;

            var questId = new MongoId(questKey);
            if (!_quests.TryGetValue(questId, out var quest)) continue;

            if (!_editableSet.Contains(questId)) continue;

            quest.Rewards ??= new Dictionary<string, List<Reward>>();
            if (!quest.Rewards.TryGetValue("Started", out var started))
            {
                started = [];
                quest.Rewards["Started"] = started;
            }

            started.AddRange(rewards);

            _defaultRewardsAdded += rewards.Count;
            _defaultQuestsTouched += 1;
            
            if (_modConfig is not { DebugLogging: true }) continue;
            foreach (var r in rewards)
            {
                var tpl = r.Items?.FirstOrDefault()?.Template.ToString();
                var name = !string.IsNullOrEmpty(tpl) ? itemHelper.GetItemName(tpl) : "(no item)";
                logger.Info($"[Gunsmith Tweaks] Quest: {quest.QuestName} || Reward: {name})");
            }
        }
    }


    private async Task LoreAccurateRewards()
    {
        logger.Info("[Gunsmith Tweaks] Lore accurate rewards enabled.");

        var loreDict = await json.DeserializeFromFileAsync<Dictionary<string, List<Reward>>>(_loreAccuratePath) ??
            throw new NullReferenceException("Could not deserialize lore accurate rewards!");

        foreach (var (questKey, rewards) in loreDict)
        {
            if (string.IsNullOrWhiteSpace(questKey) || rewards.Count == 0) continue;
            if (!MongoId.IsValidMongoId(questKey)) continue;

            var questId = new MongoId(questKey);
            if (!_quests.TryGetValue(questId, out var quest)) continue;
            if (!_editableSet.Contains(questId)) continue;

            quest.Rewards ??= new Dictionary<string, List<Reward>>();
            if (!quest.Rewards.TryGetValue("Started", out var started))
            {
                started = [];
                quest.Rewards["Started"] = started;
            }

            started.AddRange(rewards);

            _loreRewardsAdded++;
            _loreQuestsTouched++;

            if (_modConfig is not { DebugLogging: true }) continue;
            foreach (var r in rewards)
            {
                var tpl = r.Items?.FirstOrDefault()?.Template.ToString();
                var name = !string.IsNullOrEmpty(tpl) ? itemHelper.GetItemName(tpl) : "(no item)";
                logger.Info($"[Gunsmith Tweaks] Quest: {quest.QuestName} || Reward: {name}");
            }
        }
    }

    private async Task DescriptionRewards()
    {
        var descDict = await json.DeserializeFromFileAsync<Dictionary<string, Description>>(_descriptionsPath)
                       ?? throw new NullReferenceException("Could not deserialize description rewards!");

        foreach (var (questKey, entry) in descDict)
        {
            if (string.IsNullOrWhiteSpace(questKey) || string.IsNullOrWhiteSpace(entry.Desc)) continue;
            if (!MongoId.IsValidMongoId(questKey)) continue;

            var questId = new MongoId(questKey);
            if (!_quests.TryGetValue(questId, out var quest)) continue;
            if (!_editableSet.Contains(questId)) continue;

            quest.Description = entry.Desc!;
            _descUpdated++;

            if (_modConfig is not { DebugLogging: true }) continue;
            logger.Info($"[Gunsmith Tweaks] Description set for '{quest.QuestName}'");
        }
    }

    public class ModConfig
    {
        public bool DefaultRewards { get; set; }
        public bool LoreAccurate { get; set; }
        public bool DebugLogging { get; set; }
    }
}