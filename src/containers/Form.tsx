import { connect, Dispatch } from "react-redux";
import { IPropsState, IPropsDispatch, Form } from "../components/Form";
import * as store from "../store";

export function mapStateToProps({ marginCalculator }: store.IStoreState): IPropsState {
  return { marginCalculator };
}

export function mapDispatchToProps(dispatch: Dispatch<any>): IPropsDispatch {
  return {
    reset: () => dispatch(store.reset(undefined)),
    recalculate: () => dispatch(store.recalculate(undefined)),
    updateCostPrice: (payload: store.IUpdate) => dispatch(store.updateCostPrice(payload)),
    updateSalePrice: (payload: store.IUpdate) => dispatch(store.updateSalePrice(payload)),
    updateMargin: (payload: store.IUpdate) => dispatch(store.updateMargin(payload)),
    updateMarkup: (payload: store.IUpdate) => dispatch(store.updateMarkup(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
