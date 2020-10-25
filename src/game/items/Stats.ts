export type StatType =
    "strength" |
    "dexterity" |
    "intellect" |
    "spirit" |
    "fear";

/** Pyramid style distribution from 0 - 2  */
export function Gaussish(){
    return Math.random() + Math.random();
}

/** Cheap version of normal distribution from 0 - 2N (in increments of .5) */
export function N2Gaussish(n: number){
    let sum = 0;
    for(let i = 0; i < n * 2; i++){
        sum += Math.random();
    }

    return sum;
}

export interface Stats {
    get(stat: StatType): number;
    roll(stat: StatType): number;
    buff(stat: StatType, buff: number): number;
    damage(stat: StatType, damage: number): number;
}

export class PlayerStats implements Stats {
    private holder = new Map<StatType, number>();
    constructor(
        str: number,
        dex: number,
        int: number,
        spt: number,
        allowBeingSuperAmazing = false,
    ) {
        if (str + dex + int + spt > 15 && !allowBeingSuperAmazing) {
            throw new Error("You can't be that great!!");
        }
        this.holder.set("strength", str);
        this.holder.set("dexterity", dex);
        this.holder.set("intellect", int);
        this.holder.set("spirit", spt);
        this.holder.set("fear", 0);
    }
    get(stat: StatType): number {
        // All stats are always populated
        return this.holder.get(stat)!;
    }
    roll(stat: StatType): number {
        // Roll for the stat. N2 Gaussish provides a roughly normal distribution at higher numbers
        // strangely this always will do whole numbers, so partials are ignored
        return N2Gaussish(this.get(stat));
    }
    buff(stat: StatType, buff: number): number {
        throw new Error("Method not implemented.");
    }
    damage(stat: StatType, damage: number): number {
        throw new Error("Method not implemented.");
    }
}