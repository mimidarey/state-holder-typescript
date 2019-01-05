import {HolderState, StateHolder} from "../src/state-holder";

interface Handler {
    change(): void;
    say(param1: string, param2: number): void;
    plusSome(base: number): number;
}

class StateA extends HolderState<Handler> implements Handler {
    change(): void {
        console.log('StateA change called. StateA to StateB.');
        this.changeState(new StateB());
    }
    say(param1: string, param2: number): void {
        console.log('StateA say called. param1: ' + param1 + ', param2: ' + param2);
    }

    plusSome(base: number): number {
        return base + 1;
    }
}

class StateB extends HolderState<Handler> implements Handler {
    change(): void {
        console.log('StateB change called. StateB to StateA.');
        this.changeState(new StateA());
    }
    say(param1: string, param2: number): void {
        console.log('StateB say called. param1: ' + param1 + ', param2: ' + (param2 * 2));
    }

    plusSome(base: number): number {
        return base + 100;
    }
}

const holder = StateHolder.createProxy<Handler>();
holder.changeState(new StateA());
holder.say('test arg1', 42);
holder.say('test arg1', 42);
console.log(holder.plusSome(42));
holder.change();
holder.say('test arg1', 42);
holder.say('test arg1', 42);
console.log(holder.plusSome(42));
holder.change();
holder.say('test arg1', 42);
holder.say('test arg1', 42);
console.log(holder.plusSome(42));
