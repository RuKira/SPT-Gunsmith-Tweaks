import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { DatabaseService } from "@spt/services/DatabaseService";
import { ItemHelper } from "@spt/helpers/ItemHelper";

import config from "../config/config.json";
import defaultRewards = require("../db/Default.json");
import loreAccurate = require("../db/LoreAccurate.json");

/*
Gunsmith IDs for reference
    GunsmithPart1: "5ac23c6186f7741247042bad", // Gunsmith Part 1 - GUN: MP-133
    GunsmithPart2: "5ac2426c86f774138762edfe", // Gunsmith Part 2 - GUN: AKS-74U
    GunsmithPart3: "5ac2428686f77412450b42bf", // Gunsmith Part 3 - GUN: MP5
    GunsmithPart4: "639872f9decada40426d3447", // Gunsmith Part 4 - GUN: OP-SKS - Parts: 6
    GunsmithPart5: "5ae3267986f7742a413592fe", // Gunsmith Part 5 - GUN: Remington Model 870 - Parts: 4
    GunsmithPart6: "5ae3270f86f77445ba41d4dd", // Gunsmith Part 6 - GUN: AKM - Parts: 4
    GunsmithPart7: "5ac244eb86f7741356335af1", // Gunsmith Part 7 - GUN: M4A1 - Parts: 5
    GunsmithPart8: "5ae3277186f7745973054106", // Gunsmith Part 8 - GUN: AKS-74N - Parts: 4
    GunsmithPart9: "639872fa9b4fb827b200d8e5", // Gunsmith Part 9 - GUN: P226R - Parts: 4
    GunsmithPart10: "5ae327c886f7745c7b3f2f3f", // Gunsmith Part 10 - GUN: AK-105 - Parts: 6
    GunsmithPart11: "639872fc93ae507d5858c3a6", // Gunsmith Part 11 - GUN: KRISS Vector 9x19 - Parts: 5
    GunsmithPart12: "5b47799d86f7746c5d6a5fd8", // Gunsmith Part 12 - GUN: SIG MPX - Parts: 2
    GunsmithPart13: "5ac244c486f77413e12cf945", // Gunsmith Part 13 - GUN: R11 RSASS - Parts: 3
    GunsmithPart14: "639872fe8871e1272b10ccf6", // Gunsmith Part 14 - GUN: HK 416A5 - Parts: 9
    GunsmithPart15: "5ae3280386f7742a41359364", // Gunsmith Part 15 - GUN: AS VAL - Parts: 3
    GunsmithPart16: "5ac242ab86f77412464f68b4", // Gunsmith Part 16 - GUN: DVL-10
    GunsmithPart17: "5b47749f86f7746c5d6a5fd4", // Gunsmith Part 17 - GUN: AK-102 - Parts: 7
    GunsmithPart18: "5b477b6f86f7747290681823", // Gunsmith Part 18 - GUN: AKMN - Parts: 4
    GunsmithPart19: "639873003693c63d86328f25", // Gunsmith Part 19 - GUN: SVDS - Parts: 4
    GunsmithPart20: "5b477f7686f7744d1b23c4d2", // Gunsmith Part 20 - GUN: M1A - Parts: 5
    GunsmithPart21: "63987301e11ec11ff5504036", // Gunsmith Part 21 - GUN: M700 & M1911 - Parts: M700 - 3 | M1911 - 4
    GunsmithPart22: "5b47825886f77468074618d3", // Gunsmith Part 22 - GUN: M4A1 - Parts: 8
    GunsmithPart23: "64f83bb69878a0569d6ecfbe", // Gunsmith Part 23 - GUN: CMMG Mk47 Mutant - Parts: 6
    GunsmithPart24: "64f83bcdde58fc437700d8fa", // Gunsmith Part 24 - GUN: KAC SR-25 - Parts: 10
    GunsmithPart25: "64f83bd983cfca080a362c82", // Gunsmith Part 25 - GUN: PKP machine gun - Parts: 10
*/


class Mod implements IPostDBLoadMod {

    public postDBLoad(container: DependencyContainer): void 
    {
        const logPrefix = "[Gunsmith Tweaks]";

        const itemHelper = container.resolve<ItemHelper>("ItemHelper");
        const db = container.resolve<DatabaseService>("DatabaseService");
        const questTable = db.getQuests();

        const selectedRewardConfig = config.LoreAccurate ? loreAccurate : defaultRewards;

        if (config.enabled) 
        { // Enable or disable the mod
            if (config.debugLogging) console.log(`${logPrefix} Applying Gunsmith tweaks...`);

            for (const quest in selectedRewardConfig)
            {
                const gunsmithQuest = selectedRewardConfig[quest]
                for (const reward in gunsmithQuest)
                {
                    if (config.debugLogging)
                    {
                        const itemName = itemHelper.getItemName(gunsmithQuest[reward].items[0]._tpl)
                        console.log(`${logPrefix} Quest: ${questTable[quest].QuestName} || Reward: ${itemName}`);
                    }
                    questTable[quest].rewards.Started.push(gunsmithQuest[reward]);
                }
            }
        }
		
        /*
		
		if (CONFIG.enabled && CONFIG.LoreAccurate) 
		{

                    // Gunsmith Part 5
                    log("Adding Remington Model 870 Parts to Gunsmith Part 5...");
                    const setupGunsmithP5 = quests[IDS.GunsmithPart5].rewards.Started;
					const newGP5P1Reward = {
						"findInRaid": true,
						"id": "675082bce7bfb3ea5f342aea",
						"index": 1,
						"items": [
							{
								"_id": "675082c052af424beb67ffb5",
								"_tpl": "5c0111ab0db834001966914d", // ME Cylinder 12ga muzzle adapter
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675082c052af424beb67ffb5",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP5P2Reward = {
						"findInRaid": true,
						"id": "675082c5eb33ca3457850364",
						"index": 1,
						"items": [
							{
								"_id": "675082c9bb06572827961a69",
								"_tpl": "58272d7f2459774f6311ddfd", // GK-02 12ga muzzle brake
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675082c9bb06572827961a69",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP5P3Reward = {
						"findInRaid": true,
						"id": "675082d064383a9f81792c66",
						"index": 1,
						"items": [
							{
								"_id": "675082d59d6c0314fb0ec26c",
								"_tpl": "5c87ca002e221600114cb150", // KAC vertical foregrip
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675082d59d6c0314fb0ec26c",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP5P4Reward = {
						"findInRaid": true,
						"id": "675082dbd08fb6d98e257c83",
						"index": 1,
						"items": [
							{
								"_id": "675082ded8b4c46ac5544ea2",
								"_tpl": "5cc9c20cd7f00c001336c65d", // NcSTAR Tactical blue laser LAM-module
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675082ded8b4c46ac5544ea2",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					setupGunsmithP5.push(newGP5P1Reward);
					setupGunsmithP5.push(newGP5P2Reward);
					setupGunsmithP5.push(newGP5P3Reward);
					setupGunsmithP5.push(newGP5P4Reward);

                    // Gunsmith Part 6
                    log("Adding AKM Parts to Gunsmith Part 6...");
                    const setupGunsmithP6 = quests[IDS.GunsmithPart6].rewards.Started;
					const newGP6P1Reward = {
						"findInRaid": true,
						"id": "675085970c7e09fd0bd1707e",
						"index": 1,
						"items": [
							{
								"_id": "6750859a1d72f1fa207d527c",
								"_tpl": "5947f92f86f77427344a76b1", // AK TAPCO SAW-Style pistol grip (Black)
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750859a1d72f1fa207d527c",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP6P2Reward = {
						"findInRaid": true,
						"id": "675085a04e4d8e584b02cbd1",
						"index": 1,
						"items": [
							{
								"_id": "675085a3e771a92bbdd206f4",
								"_tpl": "57cff947245977638e6f2a19", // AK Magpul MOE AKM handguard (Black)
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675085a3e771a92bbdd206f4",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP6P3Reward = {
						"findInRaid": true,
						"id": "675085a91b22eaf9d2c951a7",
						"index": 1,
						"items": [
							{
								"_id": "675085ace88c46c030b33cdb",
								"_tpl": "5b7be4895acfc400170e2dd5", // Magpul M-LOK 4.1 inch rail
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675085ace88c46c030b33cdb",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP6P4Reward = {
						"findInRaid": true,
						"id": "675085b2ff324f266e384d02",
						"index": 1,
						"items": [
							{
								"_id": "675085b68b62ec817ad76b4e",
								"_tpl": "5d2c76ed48f03532f2136169", // AK AKademia Bastion dust cover
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675085b68b62ec817ad76b4e",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					setupGunsmithP6.push(newGP6P1Reward);
					setupGunsmithP6.push(newGP6P2Reward);
					setupGunsmithP6.push(newGP6P3Reward);
					setupGunsmithP6.push(newGP6P4Reward);

                    // Gunsmith Part 7
                    log("Adding M4A1 Parts to Gunsmith Part 7...");
                    const setupGunsmithP7 = quests[IDS.GunsmithPart7].rewards.Started;
					const newGP7P1Reward = {
						"findInRaid": true,
						"id": "67508ffdb9add1f7b640dd47",
						"index": 1,
						"items": [
							{
								"_id": "67509001c3393929d741c013",
								"_tpl": "59db7e1086f77448be30ddf3", // Trijicon ACOG TA11D 3.5x35 scope
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "67509001c3393929d741c013",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP7P2Reward = {
						"findInRaid": true,
						"id": "67509006f1fc4102327c754d",
						"index": 1,
						"items": [
							{
								"_id": "67509009ae16fe9d0d7c2d13",
								"_tpl": "5c78f2792e221600106f4683", // AR-15 Magpul MOE SL carbine length M-LOK handguard
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "67509009ae16fe9d0d7c2d13",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP7P3Reward = {
						"findInRaid": true,
						"id": "6750900f485d37a2811c72f1",
						"index": 1,
						"items": [
							{
								"_id": "6750901220fd8205771499bf",
								"_tpl": "55d35ee94bdc2d61338b4568", // AR-15 5.56x45 260mm barrel
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750901220fd8205771499bf",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP7P4Reward = {
						"findInRaid": true,
						"id": "675090197a945a692b583072",
						"index": 1,
						"items": [
							{
								"_id": "6750901cc4dc688d03d58c50",
								"_tpl": "56ea8d2fd2720b7c698b4570", // AR-15 Windham Weaponry Rail Gas Block
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750901cc4dc688d03d58c50",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP7P5Reward = {
						"findInRaid": true,
						"id": "67509045dae21bc4ff8e02a4",
						"index": 1,
						"items": [
							{
								"_id": "6750904855eb7c41229802b7",
								"_tpl": "651a8bf3a8520e48047bf708", // Daniel Defense Enhanced M-LOK Vertical Foregrip (Black)
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750904855eb7c41229802b7",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					setupGunsmithP7.push(newGP7P1Reward);
					setupGunsmithP7.push(newGP7P2Reward);
					setupGunsmithP7.push(newGP7P3Reward);
					setupGunsmithP7.push(newGP7P4Reward);
					setupGunsmithP7.push(newGP7P5Reward);

                    // Gunsmith Part 8
                    log("Adding AKS-74N Parts to Gunsmith Part 8...");
                    const setupGunsmithP8 = quests[IDS.GunsmithPart8].rewards.Started;
					const newGP8P1Reward = {
						"findInRaid": true,
						"id": "6750904dd46003f3e73a1385",
						"index": 1,
						"items": [
							{
								"_id": "67509050a1a5d11cd1521fa7",
								"_tpl": "59ecc28286f7746d7a68aa8c", // AKS-74/AKS-74U Zenit PT Lock
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "67509050a1a5d11cd1521fa7",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP8P2Reward = {
						"findInRaid": true,
						"id": "67509056c66228828fea81a7",
						"index": 1,
						"items": [
							{
								"_id": "6750905cdcf1bf4e1d8c9bb5",
								"_tpl": "5c1bc4812e22164bef5cfde7", // Zenit RK-0 tactical foregrip
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750905cdcf1bf4e1d8c9bb5",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP8P3Reward = {
						"findInRaid": true,
						"id": "675090613818835515d2aa4f",
						"index": 1,
						"items": [
							{
								"_id": "67509064c0052d3c6d59ce95",
								"_tpl": "5bed61680db834001d2c45ab", // AK-12 5.45x39 30-round magazine
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "67509064c0052d3c6d59ce95",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP8P4Reward = {
						"findInRaid": true,
						"id": "6750906903421d89148b017d",
						"index": 1,
						"items": [
							{
								"_id": "6750906b0ba6847d69d74f07",
								"_tpl": "5a5f1ce64f39f90b401987bc", // Zenit Klesch-2IKS IR illuminator with laser
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750906b0ba6847d69d74f07",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					setupGunsmithP8.push(newGP8P1Reward);
					setupGunsmithP8.push(newGP8P2Reward);
					setupGunsmithP8.push(newGP8P3Reward);
					setupGunsmithP8.push(newGP8P4Reward);

                    // Gunsmith Part 9
                    log("Adding P226R Parts to Gunsmith Part 9...");
                    const setupGunsmithP9 = quests[IDS.GunsmithPart9].rewards.Started;
					const newGP9P1Reward = {
						"findInRaid": true,
						"id": "67509071f6bd0c21d2b90e69",
						"index": 1,
						"items": [
							{
								"_id": "675090742f149c5818fe84b5",
								"_tpl": "5c920e902e221644f31c3c99", // P226 9x19 20-round extended magazine
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675090742f149c5818fe84b5",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP9P2Reward = {
						"findInRaid": true,
						"id": "675090794699d0bc552915a2",
						"index": 1,
						"items": [
							{
								"_id": "6750907c1211cd8fbc492d1a",
								"_tpl": "5cc9c20cd7f00c001336c65d", // NcSTAR Tactical blue laser LAM-module
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750907c1211cd8fbc492d1a",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP9P3Reward = {
						"findInRaid": true,
						"id": "675090811470385d2b66ca5f",
						"index": 1,
						"items": [
							{
								"_id": "6750908493e0e1098552bab1",
								"_tpl": "5c6beec32e221601da3578f2", // P226 TJ's Custom 9x19 compensator
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750908493e0e1098552bab1",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP9P4Reward = {
						"findInRaid": true,
						"id": "6750908a5df41774ae4422c6",
						"index": 1,
						"items": [
							{
								"_id": "6750908de75a42ae567a1a3e",
								"_tpl": "587de4282459771bca0ec90b", // P226 9x19 threaded barrel
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750908de75a42ae567a1a3e",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					setupGunsmithP9.push(newGP9P1Reward);
					setupGunsmithP9.push(newGP9P2Reward);
					setupGunsmithP9.push(newGP9P3Reward);
					setupGunsmithP9.push(newGP9P4Reward);

                    // Gunsmith Part 10
                    log("Adding AK-105 Parts to Gunsmith Part 10...");
                    const setupGunsmithP10 = quests[IDS.GunsmithPart10].rewards.Started;
					const newGP10P1Reward = {
						"findInRaid": true,
						"id": "67509093f1097198c6eb4d9f",
						"index": 1,
						"items": [
							{
								"_id": "67509097c39a942bca18bbe3",
								"_tpl": "5cbda392ae92155f3c17c39f", // AK 100-series polymer handguard
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "67509097c39a942bca18bbe3",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP10P2Reward = {
						"findInRaid": true,
						"id": "6750909e4e2fce86297ac46d",
						"index": 1,
						"items": [
							{
								"_id": "675090a445a93e057eaaff81",
								"_tpl": "5c87ca002e221600114cb150", // KAC vertical foregrip
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675090a445a93e057eaaff81",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP10P3Reward = {
						"findInRaid": true,
						"id": "675090aaf8bf9751fe38d4b1",
						"index": 1,
						"items": [
							{
								"_id": "675090ad4124db0e7a975530",
								"_tpl": "5d2c76ed48f03532f2136169", // AK AKademia Bastion dust cover
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675090ad4124db0e7a975530",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP10P4Reward = {
						"findInRaid": true,
						"id": "675090b63f6461d21a729272",
						"index": 1,
						"items": [
							{
								"_id": "675090b9c36c4cf0892bb8b1",
								"_tpl": "5947f92f86f77427344a76b1", // AK TAPCO SAW-Style pistol grip (Black)
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675090b9c36c4cf0892bb8b1",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP10P5Reward = {
						"findInRaid": true,
						"id": "675090be6f1a9ffd4d8ac668",
						"index": 1,
						"items": [
							{
								"_id": "675090c10360553b83ea0805",
								"_tpl": "5ac78eaf5acfc4001926317a", // AK-74M/AK-100 Zenit PT Lock
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675090c10360553b83ea0805",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP10P6Reward = {
						"findInRaid": true,
						"id": "675090c787ca088b935acb0a",
						"index": 1,
						"items": [
							{
								"_id": "675090ca4aa0669556f637c9",
								"_tpl": "5b222d405acfc400153af4fe", // AK Zenit PT-1 "Klassika" stock
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675090ca4aa0669556f637c9",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					setupGunsmithP10.push(newGP10P1Reward);
					setupGunsmithP10.push(newGP10P2Reward);
					setupGunsmithP10.push(newGP10P3Reward);
					setupGunsmithP10.push(newGP10P4Reward);
					setupGunsmithP10.push(newGP10P5Reward);
					setupGunsmithP10.push(newGP10P6Reward);

                    // Gunsmith Part 11
                    log("Adding KRISS Vector 9x19 Parts to Gunsmith Part 11...");
                    const setupGunsmithP11 = quests[IDS.GunsmithPart11].rewards.Started;
					const newGP11P1Reward = {
						"findInRaid": true,
						"id": "675090d293d47e5dbb88b77d",
						"index": 1,
						"items": [
							{
								"_id": "675090d5b8531502bd70f839",
								"_tpl": "5fbbc383d5cb881a7363194a", // KRISS Vector 9x19 6 inch barrel
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675090d5b8531502bd70f839",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP11P2Reward = {
						"findInRaid": true,
						"id": "675090da839785858927f2db",
						"index": 1,
						"items": [
							{
								"_id": "675090df8774a580f25f9296",
								"_tpl": "5a32a064c4a28200741e22de", // SilencerCo Osprey 9 9x19 sound suppressor
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675090df8774a580f25f9296",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP11P3Reward = {
						"findInRaid": true,
						"id": "675090e58da6bae371ac7dd7",
						"index": 1,
						"items": [
							{
								"_id": "675090e86ee51e4414b13c34",
								"_tpl": "5fb655b748c711690e3a8d5a", // KRISS Vector non-folding stock adapter
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675090e86ee51e4414b13c34",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP11P4Reward = {
						"findInRaid": true,
						"id": "675090ed33035d3302c6002f",
						"index": 1,
						"items": [
							{
								"_id": "675090f3810d5a4ef18b2761",
								"_tpl": "5649be884bdc2d79388b4577", // AR-15 Colt Carbine buffer tube
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675090f3810d5a4ef18b2761",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP11P5Reward = {
						"findInRaid": true,
						"id": "675090f898cc4c60862dbc0a",
						"index": 1,
						"items": [
							{
								"_id": "675090fb3f9cd0d5a92982e5",
								"_tpl": "5fbbaa86f9986c4cff3fe5f6", // AR-15 KRISS Defiance DS150 stock (Black)
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675090fb3f9cd0d5a92982e5",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					setupGunsmithP11.push(newGP11P1Reward);
					setupGunsmithP11.push(newGP11P2Reward);
					setupGunsmithP11.push(newGP11P3Reward);
					setupGunsmithP11.push(newGP11P4Reward);
					setupGunsmithP11.push(newGP11P5Reward);

                    // Gunsmith Part 12
                    log("Adding SIG MPX Parts to Gunsmith Part 12...");
                    const setupGunsmithP12 = quests[IDS.GunsmithPart12].rewards.Started;
					const newGP12P1Reward = {
						"findInRaid": true,
						"id": "67509100093b6747e8b4c370",
						"index": 1,
						"items": [
							{
								"_id": "6750910240735a2e9baf0278",
								"_tpl": "64806bdd26c80811d408d37a", // RTM Osovets P-2 tactical foregrip
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750910240735a2e9baf0278",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP12P2Reward = {
						"findInRaid": true,
						"id": "6750910c398e683d167b6ea9",
						"index": 1,
						"items": [
							{
								"_id": "6750910f81cd06a3999f1db7",
								"_tpl": "5b07dd285acfc4001754240d", // Steiner LAS/TAC 2 tactical flashlight
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750910f81cd06a3999f1db7",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					setupGunsmithP12.push(newGP12P1Reward);
					setupGunsmithP12.push(newGP12P2Reward);

                    // Gunsmith Part 13
                    log("Adding R11 RSASS Parts to Gunsmith Part 13...");
                    const setupGunsmithP13 = quests[IDS.GunsmithPart13].rewards.Started;
					const newGP13P1Reward = {
						"findInRaid": true,
						"id": "6750911551384364fba6376d",
						"index": 1,
						"items": [
							{
								"_id": "67509118e5b69e8fb25746d2",
								"_tpl": "59bffc1f86f77435b128b872", // SilencerCo Hybrid 46 Direct Thread Mount adapter
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "67509118e5b69e8fb25746d2",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP13P2Reward = {
						"findInRaid": true,
						"id": "6750911e665ebbfe7f19881d",
						"index": 1,
						"items": [
							{
								"_id": "67509122df6689a1aeb94705",
								"_tpl": "59bffbb386f77435b379b9c2", // SilencerCo Hybrid 46 multi-caliber sound suppressor
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "67509122df6689a1aeb94705",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP13P3Reward = {
						"findInRaid": true,
						"id": "6750912782f8428c658daaa7",
						"index": 1,
						"items": [
							{
								"_id": "6750912aae48fd5dcb8c378e",
								"_tpl": "651a8bf3a8520e48047bf708", // Daniel Defense Enhanced M-LOK Vertical Foregrip (Black)
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750912aae48fd5dcb8c378e",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					setupGunsmithP13.push(newGP13P1Reward);
					setupGunsmithP13.push(newGP13P2Reward);
					setupGunsmithP13.push(newGP13P3Reward);

                    // Gunsmith Part 14
                    log("Adding HK 416A5 Parts to Gunsmith Part 14...");
                    const setupGunsmithP14 = quests[IDS.GunsmithPart14].rewards.Started;
					const newGP14P1Reward = {
						"findInRaid": true,
						"id": "67509130f2650b9c0e7689e4",
						"index": 1,
						"items": [
							{
								"_id": "67509135ea1cd3788be0d8aa",
								"_tpl": "55d4887d4bdc2d962f8b4570", // 5.56x45 Colt AR-15 STANAG 30-round magazine
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "67509135ea1cd3788be0d8aa",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP14P2Reward = {
						"findInRaid": true,
						"id": "6750913a6ca9944952de9956",
						"index": 1,
						"items": [
							{
								"_id": "6750913d91f4ec2622361c61",
								"_tpl": "5c6d10fa2e221600106f3f23", // HK 416A5 Midwest Industries 9 inch M-LOK handguard
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750913d91f4ec2622361c61",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP14P3Reward = {
						"findInRaid": true,
						"id": "675091436efec302daa680ac",
						"index": 1,
						"items": [
							{
								"_id": "67509146d90256e24fab10e8",
								"_tpl": "6269220d70b6c02e665f2635", // Magpul M-LOK Cantilever Mount
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "67509146d90256e24fab10e8",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP14P4Reward = {
						"findInRaid": true,
						"id": "6750914c30a6adca38353eb4",
						"index": 1,
						"items": [
							{
								"_id": "6750914f6b833a0afc294bb0",
								"_tpl": "5bb20d92d4351e00853263eb", // HK 416A5 5.56x45 11 inch barrel
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750914f6b833a0afc294bb0",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP14P5Reward = {
						"findInRaid": true,
						"id": "675091546051bdc0acfdba05",
						"index": 1,
						"items": [
							{
								"_id": "675091580b6795407710a277",
								"_tpl": "5c7fb51d2e2216001219ce11", // AR-15 SureFire SF3P 5.56x45 Flash hider
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675091580b6795407710a277",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP14P6Reward = {
						"findInRaid": true,
						"id": "6750915df6130c67f8caeb42",
						"index": 1,
						"items": [
							{
								"_id": "6750916026c5fde13b362007",
								"_tpl": "5b7be4895acfc400170e2dd5", // Magpul M-LOK 4.1 inch rail
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750916026c5fde13b362007",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP14P7Reward = {
						"findInRaid": true,
						"id": "6750916753e8eb89d3fa2d86",
						"index": 1,
						"items": [
							{
								"_id": "6750916a7ef9822583f1b730",
								"_tpl": "5c06595c0db834001a66af6c", // LA-5B/PEQ tactical device
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750916a7ef9822583f1b730",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP14P8Reward = {
						"findInRaid": true,
						"id": "67509170069bb34ed94c2654",
						"index": 1,
						"items": [
							{
								"_id": "675091721efcda1f398971a5",
								"_tpl": "5bc09a18d4351e003562b68e", // Magpul MBUS Gen2 flip-up rear sight
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675091721efcda1f398971a5",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP14P9Reward = {
						"findInRaid": true,
						"id": "67509177557a9dc847a11f53",
						"index": 1,
						"items": [
							{
								"_id": "6750917a97c5afa70cb9337f",
								"_tpl": "5bc09a30d4351e00367fb7c8", // Magpul MBUS Gen2 flip-up front sight
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750917a97c5afa70cb9337f",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					setupGunsmithP14.push(newGP14P1Reward);
					setupGunsmithP14.push(newGP14P2Reward);
					setupGunsmithP14.push(newGP14P3Reward);
					setupGunsmithP14.push(newGP14P4Reward);
					setupGunsmithP14.push(newGP14P5Reward);
					setupGunsmithP14.push(newGP14P6Reward);
					setupGunsmithP14.push(newGP14P7Reward);
					setupGunsmithP14.push(newGP14P8Reward);
					setupGunsmithP14.push(newGP14P9Reward);

                    // Gunsmith Part 15
                    log("Adding AS VAL Parts to Gunsmith Part 15...");
                    const setupGunsmithP15 = quests[IDS.GunsmithPart15].rewards.Started;
					const newGP15P1Reward = {
						"findInRaid": true,
						"id": "67509187e2b95d0f582b74d2",
						"index": 1,
						"items": [
							{
								"_id": "6750918ca9ced55f6ec85b60",
								"_tpl": "544909bb4bdc2d6f028b4577", // AN/PEQ-15 tactical device
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750918ca9ced55f6ec85b60",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP15P2Reward = {
						"findInRaid": true,
						"id": "675091926d52c8831754f4ef",
						"index": 1,
						"items": [
							{
								"_id": "67509197b48bea78705f43de",
								"_tpl": "5a9e81fba2750c00164f6b11", // 9x39 SR3M.130 30-round magazine
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "67509197b48bea78705f43de",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP15P3Reward = {
						"findInRaid": true,
						"id": "6750919dd4df0b73e9906d03",
						"index": 1,
						"items": [
							{
								"_id": "6750919f039e29701b728fff",
								"_tpl": "5a9eb32da2750c00171b3f9c", // AR-15 FAB Defense GL-SHOCK buttstock
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750919f039e29701b728fff",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					setupGunsmithP15.push(newGP15P1Reward);
					setupGunsmithP15.push(newGP15P2Reward);
					setupGunsmithP15.push(newGP15P3Reward);

                    // Gunsmith Part 17
                    log("Adding AK-102 Parts to Gunsmith Part 17...");
                    const setupGunsmithP17 = quests[IDS.GunsmithPart17].rewards.Started;
					const newGP17P1Reward = {
						"findInRaid": true,
						"id": "675091a350364322fcd50f40",
						"index": 1,
						"items": [
							{
								"_id": "675091a69ad43771b4de7c36",
								"_tpl": "5947f92f86f77427344a76b1", // AK TAPCO SAW-Style pistol grip (Black)
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675091a69ad43771b4de7c36",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP17P2Reward = {
						"findInRaid": true,
						"id": "675091ab6becc3193e8ce16a",
						"index": 1,
						"items": [
							{
								"_id": "675091afd5dba995699fcea8",
								"_tpl": "5fbbaa86f9986c4cff3fe5f6", // AR-15 KRISS Defiance DS150 stock (Black)
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675091afd5dba995699fcea8",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP17P3Reward = {
						"findInRaid": true,
						"id": "675091b4106d888cc9388bd0",
						"index": 1,
						"items": [
							{
								"_id": "675091b79b1d017bbfa25daa",
								"_tpl": "588226ef24597767af46e39c", // Magpul AFG tactical foregrip (Olive Drab)
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675091b79b1d017bbfa25daa",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP17P4Reward = {
						"findInRaid": true,
						"id": "675091bb66e9becc2cbef0ce",
						"index": 1,
						"items": [
							{
								"_id": "675091bed73fb7886a6845a1",
								"_tpl": "5b3a337e5acfc4704b4a19a0", // Zenit Klesch-2U tactical flashlight
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675091bed73fb7886a6845a1",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP17P5Reward = {
						"findInRaid": true,
						"id": "675091c3d8c8ee7e652302a0",
						"index": 1,
						"items": [
							{
								"_id": "675091c5996daf04ab1d2a73",
								"_tpl": "5c0548ae0db834001966a3c2", // SLR-106/AK 5.56x45 Circle 10 30-round magazine
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675091c5996daf04ab1d2a73",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP17P6Reward = {
						"findInRaid": true,
						"id": "675091c9fab19813c45df981",
						"index": 1,
						"items": [
							{
								"_id": "675091cc6c4c1389785e781f",
								"_tpl": "6130ca3fd92c473c77020dbd", // AK CSS knurled charging handle
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675091cc6c4c1389785e781f",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP17P7Reward = {
						"findInRaid": true,
						"id": "675091c9fab19813c45df981",
						"index": 1,
						"items": [
							{
								"_id": "675091cc6c4c1389785e781f",
								"_tpl": "5649af884bdc2d1b2b8b4589", // AK Zenit B-33 dust cover
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675091cc6c4c1389785e781f",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					setupGunsmithP17.push(newGP17P1Reward);
					setupGunsmithP17.push(newGP17P2Reward);
					setupGunsmithP17.push(newGP17P3Reward);
					setupGunsmithP17.push(newGP17P4Reward);
					setupGunsmithP17.push(newGP17P5Reward);
					setupGunsmithP17.push(newGP17P6Reward);
					setupGunsmithP17.push(newGP17P7Reward);

                    // Gunsmith Part 18
                    log("Adding AKMN Parts to Gunsmith Part 18...");
                    const setupGunsmithP18 = quests[IDS.GunsmithPart18].rewards.Started;
					const newGP18P1Reward = {
						"findInRaid": true,
						"id": "675091d7253443752582d462",
						"index": 1,
						"items": [
							{
								"_id": "675091dac1d51950a9cede00",
								"_tpl": "5b0e794b5acfc47a877359b2", // AKM/AK-74 Magpul Zhukov-S stock
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675091dac1d51950a9cede00",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP18P2Reward = {
						"findInRaid": true,
						"id": "675091dfcaf38f057119eaeb",
						"index": 1,
						"items": [
							{
								"_id": "675091e24b3bb75ffebd8a57",
								"_tpl": "59d6272486f77466146386ff", // AK 7.62x39 Magpul PMAG 30 GEN M3 30-round magazine
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675091e24b3bb75ffebd8a57",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP18P3Reward = {
						"findInRaid": true,
						"id": "675091e7d01cbb59cd3853a5",
						"index": 1,
						"items": [
							{
								"_id": "675091ea49c9bc35e8a78828",
								"_tpl": "5a9fbacda2750c00141e080f", // Rotor 43 7.62 Sound Suppressor (Labeled as Rotor 43 7.62x39 muzzle break-compensator)
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675091ea49c9bc35e8a78828",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP18P4Reward = {
						"findInRaid": true,
						"id": "675091f1be60ff2c2bdcec9c",
						"index": 1,
						"items": [
							{
								"_id": "675091f3ae49f1fbad5a824f",
								"_tpl": "5d2c76ed48f03532f2136169", // AK AKademia Bastion dust cover
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675091f3ae49f1fbad5a824f",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					setupGunsmithP18.push(newGP18P1Reward);
					setupGunsmithP18.push(newGP18P2Reward);
					setupGunsmithP18.push(newGP18P3Reward);
					setupGunsmithP18.push(newGP18P4Reward);

                    // Gunsmith Part 19
                    log("Adding SVDS Parts to Gunsmith Part 19...");
                    const setupGunsmithP19 = quests[IDS.GunsmithPart19].rewards.Started;
					const newGP19P1Reward = {
						"findInRaid": true,
						"id": "675091f9816903632738644f",
						"index": 1,
						"items": [
							{
								"_id": "675091fd3b6e0ea6df29bdba",
								"_tpl": "6197b229af1f5202c57a9bea", // SVDS Lynx Arms Hinge buffer tube adapter
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675091fd3b6e0ea6df29bdba",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP19P2Reward = {
						"findInRaid": true,
						"id": "675092033fa46daf05abfd10",
						"index": 1,
						"items": [
							{
								"_id": "6750920514b1a8fee1c9ca45",
								"_tpl": "5dfce88fe9dc277128008b2e", // SVDS custom cut dust cover
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750920514b1a8fee1c9ca45",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP19P3Reward = {
						"findInRaid": true,
						"id": "6750920aaefb4456a0ff4361",
						"index": 1,
						"items": [
							{
								"_id": "6750920c4fffabd8f941a00c",
								"_tpl": "5e01e9e273d8eb11426f5bc3", // SVDS Rotor 43 thread adapter
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750920c4fffabd8f941a00c",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP19P4Reward = {
						"findInRaid": true,
						"id": "67509211f48a74529ad451e3",
						"index": 1,
						"items": [
							{
								"_id": "67509213ead8feddb5807c63",
								"_tpl": "6516b129609aaf354b34b3a8", // SVDS Lynx Arms AK-series pistol grip adapter
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "67509213ead8feddb5807c63",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					setupGunsmithP19.push(newGP19P1Reward);
					setupGunsmithP19.push(newGP19P2Reward);
					setupGunsmithP19.push(newGP19P3Reward);
					setupGunsmithP19.push(newGP19P4Reward);

                    // Gunsmith Part 20
                    log("Adding M1A Parts to Gunsmith Part 20...");
                    const setupGunsmithP20 = quests[IDS.GunsmithPart20].rewards.Started;
					const newGP20P1Reward = {
						"findInRaid": true,
						"id": "6750921929aee52b1a456935",
						"index": 1,
						"items": [
							{
								"_id": "6750921c10a0a0db1a2527fb",
								"_tpl": "5aaf8a0be5b5b00015693243", // M1A 7.62x51 20-round magazine
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750921c10a0a0db1a2527fb",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP20P2Reward = {
						"findInRaid": true,
						"id": "67509221d97b89bf825dacb5",
						"index": 1,
						"items": [
							{
								"_id": "6750922785db1f93a56367ca",
								"_tpl": "58d399e486f77442e0016fe7", // Aimpoint Micro T-1 reflex sight
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750922785db1f93a56367ca",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP20P3Reward = {
						"findInRaid": true,
						"id": "6750922b0237397b7b237f44",
						"index": 1,
						"items": [
							{
								"_id": "6750922e2882a267d7485961",
								"_tpl": "58d39d3d86f77445bb794ae7", // Aimpoint Micro Standard Mount
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750922e2882a267d7485961",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP20P4Reward = {
						"findInRaid": true,
						"id": "67509232ec5a6afc4bf0c133",
						"index": 1,
						"items": [
							{
								"_id": "67509234b87d50d395934717",
								"_tpl": "57fd23e32459772d0805bcf1", // Holosun LS321 Tactical device
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "67509234b87d50d395934717",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP20P5Reward = {
						"findInRaid": true,
						"id": "67509239e2d220b6c3374337",
						"index": 1,
						"items": [
							{
								"_id": "6750923c121b03b798a43e04",
								"_tpl": "5addbfef5acfc400185c2857", // M14 Leapers UTG 4-Point Locking Deluxe mount
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750923c121b03b798a43e04",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					setupGunsmithP20.push(newGP20P1Reward);
					setupGunsmithP20.push(newGP20P2Reward);
					setupGunsmithP20.push(newGP20P3Reward);
					setupGunsmithP20.push(newGP20P4Reward);
					setupGunsmithP20.push(newGP20P5Reward);

                    // Gunsmith Part 21
                    log("Adding M700 & M1911 Parts to Gunsmith Part 21...");
                    const setupGunsmithP21 = quests[IDS.GunsmithPart21].rewards.Started;
                    const setupGunsmithP21M1911 = quests[IDS.GunsmithPart21].rewards.Started;
					const newGP21P1Reward = {
						"findInRaid": true,
						"id": "6750924336d3e6b01db5d53e",
						"index": 2,
						"items": [
							{
								"_id": "67509246f8e8dabe87367f98",
								"_tpl": "5a339805c4a2826c6e06d73d", // AR-15 Magpul MIAD pistol grip (FDE)
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "67509246f8e8dabe87367f98",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP21P2Reward = {
						"findInRaid": true,
						"id": "6750924b18957ba0d9e7bb94",
						"index": 2,
						"items": [
							{
								"_id": "6750924d004d9ea6a72e5283",
								"_tpl": "5649be884bdc2d79388b4577", // AR-15 Colt Carbine buffer tube
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750924d004d9ea6a72e5283",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP21P3Reward = {
						"findInRaid": true,
						"id": "67509254e5ab5e544650c72b",
						"index": 2,
						"items": [
							{
								"_id": "67509256ac7e1840344fedb3",
								"_tpl": "5fbbaa86f9986c4cff3fe5f6", // AR-15 KRISS Defiance DS150 stock (Black)
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "67509256ac7e1840344fedb3",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP21M1P1Reward = {
						"findInRaid": true,
						"id": "6750925c4fa4627c741aa6f6",
						"index": 3,
						"items": [
							{
								"_id": "6750925e0f5066d3bf875aec",
								"_tpl": "5ef366938cef260c0642acad", // M1911 Pachmayr American Legend Grip #423
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750925e0f5066d3bf875aec",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP21M1P2Reward = {
						"findInRaid": true,
						"id": "6750926730f9f6cabedcae6e",
						"index": 3,
						"items": [
							{
								"_id": "6750926c9a3c3e8700b128c2",
								"_tpl": "5ef61964ec7f42238c31e0c1", // M1911 Anarchy Outdoors .45 ACP muzzle brake
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750926c9a3c3e8700b128c2",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP21M1P3Reward = {
						"findInRaid": true,
						"id": "67509273933f5b59f3187a46",
						"index": 3,
						"items": [
							{
								"_id": "6750927529c9da993301531e",
								"_tpl": "5ef369b08cef260c0642acaf", // M1911A1 NcSTAR trigger guard mount
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750927529c9da993301531e",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP21M1P4Reward = {
						"findInRaid": true,
						"id": "675092798af96212f9cfaf63",
						"index": 3,
						"items": [
							{
								"_id": "6750927c4dacee3fb43b83ea",
								"_tpl": "5cc9c20cd7f00c001336c65d", // NcSTAR Tactical blue laser LAM-module
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750927c4dacee3fb43b83ea",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					setupGunsmithP21.push(newGP21P1Reward);
					setupGunsmithP21.push(newGP21P2Reward);
					setupGunsmithP21.push(newGP21P3Reward);
					setupGunsmithP21M1911.push(newGP21M1P1Reward);
					setupGunsmithP21M1911.push(newGP21M1P2Reward);
					setupGunsmithP21M1911.push(newGP21M1P3Reward);
					setupGunsmithP21M1911.push(newGP21M1P4Reward);

                    // Gunsmith Part 22
                    log("Adding M4A1 Parts to Gunsmith Part 22...");
                    const setupGunsmithP22 = quests[IDS.GunsmithPart22].rewards.Started;
					const newGP22P1Reward = {
						"findInRaid": true,
						"id": "67509282ae9ee27f130d8d5e",
						"index": 1,
						"items": [
							{
								"_id": "675092859e7b9552789b1663",
								"_tpl": "5b30bc285acfc47a8608615d", // Alexander Arms 10 inch rail
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675092859e7b9552789b1663",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP22P2Reward = {
						"findInRaid": true,
						"id": "6750928c768c1021a35f75be",
						"index": 1,
						"items": [
							{
								"_id": "6750928e70bd242a0e07ebc1",
								"_tpl": "64806bdd26c80811d408d37a", // RTM Osovets P-2 tactical foregrip
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750928e70bd242a0e07ebc1",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP22P3Reward = {
						"findInRaid": true,
						"id": "6750929420a9ac29be963b5c",
						"index": 1,
						"items": [
							{
								"_id": "67509298d6d2c4afffa2c19f",
								"_tpl": "5b2cfa535acfc432ff4db7a0", // AR-15 Alexander Arms MK10 rifle length handguard
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "67509298d6d2c4afffa2c19f",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP22P4Reward = {
						"findInRaid": true,
						"id": "6750929dde8cf9c69d423bb6",
						"index": 1,
						"items": [
							{
								"_id": "675092a09f2972010db11abc",
								"_tpl": "59db3a1d86f77429e05b4e92", // AR-15 Naroh Arms GRAL-S pistol grip
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675092a09f2972010db11abc",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP22P5Reward = {
						"findInRaid": true,
						"id": "675092a50aa6a0745238ae4c",
						"index": 1,
						"items": [
							{
								"_id": "675092a871d1d95fa5574d20",
								"_tpl": "55d35ee94bdc2d61338b4568", // AR-15 5.56x45 260mm barrel
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675092a871d1d95fa5574d20",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP22P6Reward = {
						"findInRaid": true,
						"id": "675092ad57a00f87e61eb96f",
						"index": 1,
						"items": [
							{
								"_id": "675092b0a80b97875ddff1ca",
								"_tpl": "56ea8180d2720bf2698b456a", // AR-15 KAC QDC 5.56x45 Flash Suppressor Kit
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675092b0a80b97875ddff1ca",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP22P7Reward = {
						"findInRaid": true,
						"id": "675092b4d9de68696cdde7fb",
						"index": 1,
						"items": [
							{
								"_id": "675092b6215fcb05d7f90a22",
								"_tpl": "56eabcd4d2720b66698b4574", // AR-15 Daniel Defense MK12 Low Profile Gas Block
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675092b6215fcb05d7f90a22",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP22P8Reward = {
						"findInRaid": true,
						"id": "675092ba69e1be41c89a1ce1",
						"index": 1,
						"items": [
							{
								"_id": "675092bedac30450033ee21a",
								"_tpl": "591aef7986f774139d495f03", // AR-15 TROY M7A1 PDW stock (Black)
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675092bedac30450033ee21a",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					setupGunsmithP22.push(newGP22P1Reward);
					setupGunsmithP22.push(newGP22P2Reward);
					setupGunsmithP22.push(newGP22P3Reward);
					setupGunsmithP22.push(newGP22P4Reward);
					setupGunsmithP22.push(newGP22P5Reward);
					setupGunsmithP22.push(newGP22P6Reward);
					setupGunsmithP22.push(newGP22P7Reward);
					setupGunsmithP22.push(newGP22P8Reward);

                    // Gunsmith Part 23
                    log("Adding CMMG Mk47 Mutant Parts to Gunsmith Part 23...");
                    const setupGunsmithP23 = quests[IDS.GunsmithPart23].rewards.Started;
					const newGP23P1Reward = {
						"findInRaid": true,
						"id": "675092c3ba1594f7967c754c",
						"index": 1,
						"items": [
							{
								"_id": "675092c6babe36b3e7473576",
								"_tpl": "5bbdb8bdd4351e4502011460", // AR-10 Odin Works ATLAS-7 7.62x51 muzzle brake
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675092c6babe36b3e7473576",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP23P2Reward = {
						"findInRaid": true,
						"id": "675092cb84955f0dbba37f01",
						"index": 1,
						"items": [
							{
								"_id": "675092cd2a9c49f2814cb7a0",
								"_tpl": "5f6340d3ca442212f4047eb2", // Tactical Dynamics Skeletonized Foregrip
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675092cd2a9c49f2814cb7a0",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP23P3Reward = {
						"findInRaid": true,
						"id": "675092d2ca7124a42f92237b",
						"index": 1,
						"items": [
							{
								"_id": "675092d46ce3306f6eda8103",
								"_tpl": "5a800961159bd4315e3a1657", // Glock GTL 21 tactical flashlight with laser
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675092d46ce3306f6eda8103",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP23P4Reward = {
						"findInRaid": true,
						"id": "675092da054196eb4b0a09b3",
						"index": 1,
						"items": [
							{
								"_id": "675092dc937210903d910d6b",
								"_tpl": "59f9d81586f7744c7506ee62", // Vortex Razor AMG UH-1 holographic sight
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675092dc937210903d910d6b",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP23P5Reward = {
						"findInRaid": true,
						"id": "675092e08b53cbe0ed824d1f",
						"index": 1,
						"items": [
							{
								"_id": "675092e294e8bbdc928f8e38",
								"_tpl": "5c87a07c2e2216001219d4a2", // AR-15 HK E1 buttstock
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675092e294e8bbdc928f8e38",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP23P6Reward = {
						"findInRaid": true,
						"id": "675092e7ae351e7a01f1c720",
						"index": 1,
						"items": [
							{
								"_id": "675092e965a27723a98f2b6c",
								"_tpl": "6113cce3d92c473c770200c7", // AR-15 F1 Firearms Skeletonized Style 2 pistol grip
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675092e965a27723a98f2b6c",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					setupGunsmithP23.push(newGP23P1Reward);
					setupGunsmithP23.push(newGP23P2Reward);
					setupGunsmithP23.push(newGP23P3Reward);
					setupGunsmithP23.push(newGP23P4Reward);
					setupGunsmithP23.push(newGP23P5Reward);
					setupGunsmithP23.push(newGP23P6Reward);

                    // Gunsmith Part 24
                    log("Adding KAC SR-25 Parts to Gunsmith Part 24...");
                    const setupGunsmithP24 = quests[IDS.GunsmithPart24].rewards.Started;
					const newGP24P1Reward = {
						"findInRaid": true,
						"id": "675092ef6b51eebf7264a301",
						"index": 1,
						"items": [
							{
								"_id": "675092f1eabe96111184473b",
								"_tpl": "5d025cc1d7ad1a53845279ef", // AR-15 HK Ergo PSG-1 style pistol grip
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675092f1eabe96111184473b",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP24P2Reward = {
						"findInRaid": true,
						"id": "675092f6864643b2542a84fd",
						"index": 1,
						"items": [
							{
								"_id": "675092f9484da94d530bd201",
								"_tpl": "5df8f535bb49d91fb446d6b0", // AR-10 7.62x51 KAC 10-round steel magazine
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675092f9484da94d530bd201",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP24P3Reward = {
						"findInRaid": true,
						"id": "675092ff9fd2070147fb4ecf",
						"index": 1,
						"items": [
							{
								"_id": "675093022f2d098df6677938",
								"_tpl": "5d44069ca4b9361ebd26fc37", // AR-15 Magpul PRS GEN3 stock (Black)
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675093022f2d098df6677938",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP24P4Reward = {
						"findInRaid": true,
						"id": "6750930ce05fac807353474c",
						"index": 1,
						"items": [
							{
								"_id": "67509306e908e129f52401ac",
								"_tpl": "6269220d70b6c02e665f2635", // Magpul M-LOK Cantilever Mount
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "67509306e908e129f52401ac",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP24P5Reward = {
						"findInRaid": true,
						"id": "6750931140652a7a60dd7023",
						"index": 1,
						"items": [
							{
								"_id": "6750931338c18fe65fd3691b",
								"_tpl": "5d2369418abbc306c62e0c80", // Steiner DBAL-PL tactical device
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750931338c18fe65fd3691b",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP24P6Reward = {
						"findInRaid": true,
						"id": "6750931a7205721e2f9af740",
						"index": 1,
						"items": [
							{
								"_id": "6750931d8c1394b99aefe289",
								"_tpl": "5b7be4895acfc400170e2dd5", // Magpul M-LOK 4.1 inch rail
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750931d8c1394b99aefe289",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP24P7Reward = {
						"findInRaid": true,
						"id": "67509323fae53b1a6f1a80b0",
						"index": 1,
						"items": [
							{
								"_id": "67509326cf42ffc280bbd4b6",
								"_tpl": "5b057b4f5acfc4771e1bd3e9", // Stark SE-5 Express Forward foregrip
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "67509326cf42ffc280bbd4b6",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP24P8Reward = {
						"findInRaid": true,
						"id": "6750932d80e35e245e9b4675",
						"index": 1,
						"items": [
							{
								"_id": "67509330575903d69f2bd702",
								"_tpl": "5649a2464bdc2d91118b45a8", // NcSTAR MPR45 Backup mount
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "67509330575903d69f2bd702",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP24P9Reward = {
						"findInRaid": true,
						"id": "675093393fd7f49918eedff9",
						"index": 1,
						"items": [
							{
								"_id": "6750933c0fc38c8e1ed38d26",
								"_tpl": "577d128124597739d65d0e56", // Burris FastFire Weaver Base
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750933c0fc38c8e1ed38d26",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP24P10Reward = {
						"findInRaid": true,
						"id": "67509340c71323581f954873",
						"index": 1,
						"items": [
							{
								"_id": "67509345354a97ac59c170e3",
								"_tpl": "577d141e24597739c5255e01", // Burris FastFire 3 reflex sight
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "67509345354a97ac59c170e3",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					setupGunsmithP24.push(newGP24P1Reward);
					setupGunsmithP24.push(newGP24P2Reward);
					setupGunsmithP24.push(newGP24P3Reward);
					setupGunsmithP24.push(newGP24P4Reward);
					setupGunsmithP24.push(newGP24P5Reward);
					setupGunsmithP24.push(newGP24P6Reward);
					setupGunsmithP24.push(newGP24P7Reward);
					setupGunsmithP24.push(newGP24P8Reward);
					setupGunsmithP24.push(newGP24P9Reward);
					setupGunsmithP24.push(newGP24P10Reward);

					// Gunsmith Part 25
                    log("Adding PKP machine gun Parts to Gunsmith Part 25...");
                    const setupGunsmithP25 = quests[IDS.GunsmithPart25].rewards.Started;
					const newGP25P1Reward = {
						"findInRaid": true,
						"id": "6750934b1b7da4536e9abea5",
						"index": 1,
						"items": [
							{
								"_id": "6750934d7f9908e32161b2f9",
								"_tpl": "6491c6f6ef312a876705191b", // PK Zenit B-50 handguard
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750934d7f9908e32161b2f9",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP25P2Reward = {
						"findInRaid": true,
						"id": "67509352979353c88d8dee2a",
						"index": 1,
						"items": [
							{
								"_id": "675093557f4e63abdee53c59",
								"_tpl": "646371faf2404ab67905c8e9", // PKM 7.62x54R 658mm barrel
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675093557f4e63abdee53c59",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP25P3Reward = {
						"findInRaid": true,
						"id": "67509359471a776e16f0c5e1",
						"index": 1,
						"items": [
							{
								"_id": "6750935cac2e61b901ecb945",
								"_tpl": "6492ef63cfcf7c89e701abf1", // PK Zenit DTK-1P 7.62x54R muzzle brake
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750935cac2e61b901ecb945",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP25P4Reward = {
						"findInRaid": true,
						"id": "675093609dd00a83de04274d",
						"index": 1,
						"items": [
							{
								"_id": "675093641d96c2764dfbc625",
								"_tpl": "6492d7847363b8a52206bc52", // PK Zenit PT-2 "Klassika" stock
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "675093641d96c2764dfbc625",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP25P5Reward = {
						"findInRaid": true,
						"id": "67509367060c646700d0f772",
						"index": 1,
						"items": [
							{
								"_id": "6750936b073a57cd64097bfb",
								"_tpl": "5649ad3f4bdc2df8348b4585", // AK bakelite pistol grip (6P1 Sb.8V)
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750936b073a57cd64097bfb",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP25P6Reward = {
						"findInRaid": true,
						"id": "675093700ef6e2b52926c0e2",
						"index": 1,
						"items": [
							{
								"_id": "67509372b5a1e85e1bf0d100",
								"_tpl": "5a0c59791526d8dba737bba7", // AK GP-25 accessory kit recoil pad
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "67509372b5a1e85e1bf0d100",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP25P7Reward = {
						"findInRaid": true,
						"id": "67509378627fd5abab7e4a9a",
						"index": 1,
						"items": [
							{
								"_id": "6750937a8c07122db1cc146b",
								"_tpl": "5cf638cbd7f00c06595bc936", // NPZ USP-1 "Tyulpan" 4x scope
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "6750937a8c07122db1cc146b",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP25P8Reward = {
						"findInRaid": true,
						"id": "675093808b692d7fc9309fbb",
						"index": 1,
						"items": [
							{
								"_id": "67509382adac582c8bae3843",
								"_tpl": "5cc9c20cd7f00c001336c65d", // NcSTAR Tactical blue laser LAM-module
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "67509382adac582c8bae3843",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP25P9Reward = {
						"findInRaid": true,
						"id": "675093878c1c3e82f907ccae",
						"index": 1,
						"items": [
							{
								"_id": "67509389fb51235b74970e2c",
								"_tpl": "5947f92f86f77427344a76b1", // AK TAPCO SAW-Style pistol grip (Black)
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "67509389fb51235b74970e2c",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					const newGP25P10Reward = {
						"findInRaid": true,
						"id": "6750938c4ea584b383340e69",
						"index": 1,
						"items": [
							{
								"_id": "67509390365bb819f65bcfe9",
								"_tpl": "5cf639aad7f00c065703d455", // NPZ USP-1 scope eyecup
								"upd": {
									"StackObjectsCount": 1
								}
							}
						],
						"target": "67509390365bb819f65bcfe9",
						"type": "Item",
						"unknown": false,
						"value": 1
					}
					setupGunsmithP25.push(newGP25P1Reward);
					setupGunsmithP25.push(newGP25P2Reward);
					setupGunsmithP25.push(newGP25P3Reward);
					setupGunsmithP25.push(newGP25P4Reward);
					setupGunsmithP25.push(newGP25P5Reward);
					setupGunsmithP25.push(newGP25P6Reward);
					setupGunsmithP25.push(newGP25P7Reward);
					setupGunsmithP25.push(newGP25P8Reward);
					setupGunsmithP25.push(newGP25P9Reward);
					setupGunsmithP25.push(newGP25P10Reward);
                }
			}
        }
		*/
    }
}

export const mod = new Mod();
