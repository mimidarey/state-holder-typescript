/**
 * Copyright (c) 2019 mimidarey
 * This software is released under the MIT License.
 * https://github.com/mimidarey/state-holder-typescript
 */

/**
 *
 */
export class StateHolder<T> {
    /**
     *
     */
    private state: HolderState<T> & T;

    /**
     * change state from outside StateHolder.
     * @param state
     */
    public changeState(state: HolderState<T> & T) {
        if (this.state)
            this.state.destroy();
        this.state = state;
        this.state.setHolder(this);
    }

    /**
     * proxy method interface, holder to customized HolderState, they should have T method interface.
     */
    public static createProxy<S>(): S & StateHolder<S> {
        const holder = new StateHolder();
        const proxy = new Proxy(holder, {
            get(target: StateHolder<S>, propertyKey: PropertyKey): any {
                switch (propertyKey) {
                    case 'state':
                        return target.state;
                    case 'changeState':
                        return target.changeState;
                    default:
                        const targetMethod = Reflect.get(target.state, propertyKey);
                        if (targetMethod)
                            return function() {
                                return Reflect.apply(targetMethod, target.state, arguments);
                            }
                }
                return null;
            },
        });
        return proxy as S & StateHolder<S>;
    }
}


/**
 * base inner state.
 * customized HolderState class is must be have T method interface.
 */
export abstract class HolderState<T> {
    private holder: StateHolder<T> | null;
    public setHolder(holder: StateHolder<T>) {
        this.holder = holder;
    }

    /**
     * close state.
     */
    public destroy() {
        this.holder = null;
    }

    /**
     * change state from inside customized HolderState.
     * @param state
     */
    public changeState(state: HolderState<T> & T) {
        if (!this.holder)
            return;
        state.setHolder(this.holder);
        this.holder.changeState(state);
    }

}