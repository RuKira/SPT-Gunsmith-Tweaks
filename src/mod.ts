import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { DatabaseService } from "@spt/services/DatabaseService";
import { ItemHelper } from "@spt/helpers/ItemHelper";

import config from "../config/config.json";
import defaultRewards = require("../db/Default.json");
import descriptions = require("../db/Descriptions.json");
import loreAccurate = require("../db/LoreAccurate.json");

class Mod implements IPostDBLoadMod {

    public postDBLoad(container: DependencyContainer): void 
    {
        const logPrefix = "[Gunsmith Tweaks]";

        const itemHelper = container.resolve<ItemHelper>("ItemHelper");
        const db = container.resolve<DatabaseService>("DatabaseService");
        const questTable = db.getQuests();

        if (config.defaultRewards) { // Enable or disable the mod
            console.log(`${logPrefix} Applying Gunsmith tweaks...`);

            for (const quest in defaultRewards) {
                const gunsmithQuest = defaultRewards[quest]
                for (const reward in gunsmithQuest) {
                    if (config.debugLogging) {
                        const itemName = itemHelper.getItemName(gunsmithQuest[reward].items[0]._tpl)
                        console.log(`${logPrefix} Quest: ${questTable[quest].QuestName} || Reward: ${itemName}`);
                    }
                    questTable[quest].rewards.Started.push(gunsmithQuest[reward]);
                }
            }
			if (config.LoreAccurate) { // Enable or disable lore accurate rewards
				if (config.debugLogging) console.log(`${logPrefix} Lore accurate rewards enabled.`);
				for (const quest in loreAccurate) {
					const gunsmithQuest = loreAccurate[quest]
					for (const reward in gunsmithQuest) {
						if (config.debugLogging) {
							const itemName = itemHelper.getItemName(gunsmithQuest[reward].items[0]._tpl)
							console.log(`${logPrefix} Quest: ${questTable[quest].QuestName} || Reward: ${itemName}`);
						}
						questTable[quest].rewards.Started.push(gunsmithQuest[reward]);
					}
                    if (config.debugLogging) console.log(`${logPrefix} Quest: ${questTable[quest].QuestName} || Description: ${descriptions[quest].description}`);
                    questTable[quest].description = descriptions[quest].description;
			    }
    	    }
		    else console.log(`${logPrefix} Gunsmith tweaks are disabled.`);
        }
	}
}


export const mod = new Mod();
