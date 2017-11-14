import {Resistances} from "../types/Resistances";

export type FitResult = {

    cpu: number;
    powerGrid: number;

    hp: {
        effective: number,
        raw: number,
        shield: {
            effective: number,
            raw: number,
        },
        armor: {
            effective: number,
            raw: number,
        },
        hull: {
            effective: number,
            raw: number,
        }
    };

    tank: {
        shield: number,
        armor: number,
        hull: number,
    };

    resistance: {
        shield: Resistances,
        armor: Resistances,
        hull: Resistances,
    };

    dps: {
        drone: number,
        weapon: number,
        volley: number,
    };

    capacitor: {
        capacitor_time: number,
        capacitor_up: number,
        capacitor_down: number,
    };

    targeting: {
        max_targets: number,
        target_range: number,
        scan_resolution: number,
        sensor_strength: number
    };

    navigation: {
        speed: number,
        align_time: number,
        warp_speed: number,
        signature: number,
    };

    misc: {
        drone_range: number,
        cargo: number,
    };
}