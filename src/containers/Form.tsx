import { connect, Dispatch } from "react-redux";
import { IPropsState, IPropsDispatch, Form } from "../components/Form";
import * as store from "../store";

export function mapStateToProps({ marginCalculator, currencyRates }: store.IStoreState): IPropsState {
  return { marginCalculator, currencyRates };
}

export function mapDispatchToProps(dispatch: Dispatch<any>): IPropsDispatch {
  return {
    reset: () => dispatch(store.reset(undefined)),
    recalculate: () => dispatch(store.recalculate(undefined)),
    updateCostPrice: (payload: store.IUpdate) => dispatch(store.updateCostPrice(payload)),
    updateCostPriceCurrency: (payload: store.IUpdateCurrency) => dispatch(store.updateCostPriceCurrency(payload)),
    updateCostPriceCurrencyValue: (payload: store.IUpdate) => dispatch(store.updateCostPriceCurrencyValue(payload)),
    updateSalePrice: (payload: store.IUpdate) => dispatch(store.updateSalePrice(payload)),
    updateSalePriceCurrency: (payload: store.IUpdateCurrency) => dispatch(store.updateSalePriceCurrency(payload)),
    updateSalePriceCurrencyValue: (payload: store.IUpdate) => dispatch(store.updateSalePriceCurrencyValue(payload)),
    updateMargin: (payload: store.IUpdate) => dispatch(store.updateMargin(payload)),
    updateMarkup: (payload: store.IUpdate) => dispatch(store.updateMarkup(payload)),
    ratesRequest: () => dispatch(store.ratesRequest(undefined)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
