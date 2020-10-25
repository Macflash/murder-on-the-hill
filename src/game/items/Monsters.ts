import { Coord, Distance, MakeUnitVector, Multiply, Subtract } from "../coordinates/Coord";
import { GetItems, Item } from "./Items";
import { Player } from "./Player";
import { Creature, PlayerStats, Stats, StatType } from "./Stats";

export interface Monster extends Creature {
    attackType: StatType;
    decide_move(players: Player[]): void;
    checkForAttack(players: Player[]): Player|null;
}

const DumbMosterMoveRange = 600;
const DumbMosterAttackRange = 10;

var monsters: Monster[] = [];

export function GetMonsters(){
    return GetItems().filter(maybeMonster => !!(maybeMonster as Monster).decide_move) as Monster[];
}

export class BasicMonster implements Monster {
    attackType: StatType = "strength";
    inventory: Item[] = [];
    stats = new PlayerStats(1, 1, 1, 1);
    position = { x: 0, y: 0 };
    height = 40;
    width = 40;
    name = "Monster";
    color = "green";
    moveable = true;
    blockObjects = true;
    mass = 100;
    velocity: Coord = { x: 0, y: 0 };

    constructor(){
        monsters.push(this);
    }

    private getClosestPlayer(players: Player[]) {
        // cool
        let closest: Player = players[0];
        let closestDistance = Number.MAX_VALUE;

        players.forEach(player => {
            const dist = Distance(player.position, this.position);
            if (dist < closestDistance) {
                closestDistance = dist;
                closest = player;
            }
        });

        return { closest, closestDistance };
    }

    decide_move(players: Player[]) {
        const { closest, closestDistance } = this.getClosestPlayer(players);

        if (closestDistance < DumbMosterMoveRange) {
            this.velocity = Multiply(MakeUnitVector(Subtract(closest.position, this.position)), 3);
        }
        else {
            this.velocity = { x: 0, y: 0 };
        }
    }

    checkForAttack(players: Player[]): Player | null {
        const { closest, closestDistance } = this.getClosestPlayer(players);

        if (closestDistance < (DumbMosterAttackRange + Math.max(this.width, this.height))) {
            return closest;
        }

        return null;
    }
}