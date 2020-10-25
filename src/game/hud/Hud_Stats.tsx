import * as React from 'react';
import { MenuStyle } from "./MenuStyle";
import { Player } from "../items/Player";
import { StatType } from '../items/Stats';

// want it like.. by the player?
export function HudStats(props: { player: Player }) {
    const stats = props.player.stats;

    return <div style={{
        ...MenuStyle,
        top: 20,
        right: 20,

    }}>
            <StatRow statType="strength" num={stats.get("strength")} />
            <StatRow statType="dexterity" num={stats.get("dexterity")} />
            <StatRow statType="intellect" num={stats.get("intellect")} />
            <StatRow statType="spirit" num={stats.get("spirit")} />
            <StatRow statType="fear" num={stats.get("fear")} />
    </div>
}

function StatRow(props: {statType: StatType, num: number}){
    const {statType, num} = props;
    return <div>
        <div>{statType}: {num}</div>
    </div>
}