// DCLogic — the small base class the game-logic `Component` extends.
//
// The design document authored its logic as `class Component extends DCLogic`,
// where DCLogic was provided by the proprietary dc-runtime. This is our own,
// dependency-free replacement that gives the class exactly the surface it uses:
//   • this.props / this.state
//   • this.setState(patchOrFn, cb?)  — merges synchronously, then re-renders
//   • this.forceUpdate()
//   • the React-style lifecycle no-ops it overrides
//
// `setState` updates `this.state` synchronously (matching the original runtime's
// semantics, where code may read the new state immediately) and then asks the
// host React component to re-render via the injected `__schedule` hook.

type AnyObj = Record<string, any>;
type Updater = AnyObj | ((s: AnyObj) => AnyObj);

export class DCLogic {
  props: AnyObj;
  state: AnyObj;
  /** Injected by the host (App.tsx) to bridge setState -> React re-render. */
  __schedule?: (cb?: () => void) => void;

  constructor(props?: AnyObj) {
    this.props = props || {};
    this.state = {};
  }

  setState(update: Updater, cb?: () => void): void {
    const patch = typeof update === 'function' ? update(this.state) : update;
    this.state = { ...this.state, ...patch };
    if (this.__schedule) this.__schedule(cb);
    else if (cb) cb();
  }

  forceUpdate(): void {
    if (this.__schedule) this.__schedule();
  }

  // React-style lifecycle hooks — overridden by the game logic as needed.
  componentDidMount(): void {}
  componentDidUpdate(_prevProps?: AnyObj): void {}
  componentWillUnmount(): void {}

  // The flat object the template renders against — overridden by the game logic.
  renderVals(): AnyObj {
    return {};
  }
}
