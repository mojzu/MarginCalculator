import { connect, Dispatch } from "react-redux";
import { IPropsState, IPropsDispatch, Form } from "../components/Form";
import { IStoreState } from "../store";
import { ratesRequest } from "../store/currencyRates";
import {
  IUpdate,
  IUpdateCurrency,
  reset,
  recalculate,
  updateCostPrice,
  updateCostPriceCurrency,
  updateCostPriceCurrencyValue,
  updateSalePrice,
  updateSalePriceCurrency,
  updateSalePriceCurrencyValue,
  updateMargin,
  updateMarkup,
} from "../store/marginCalculator";

export function mapStateToProps({ currencyRates, marginCalculator }: IStoreState): IPropsState {
  return { currencyRates, marginCalculator };
}

export function mapDispatchToProps(dispatch: Dispatch<any>): IPropsDispatch {
  return {
    ratesRequest: () => dispatch(ratesRequest(undefined)),
    reset: () => dispatch(reset(undefined)),
    recalculate: () => dispatch(recalculate(undefined)),
    updateCostPrice: (payload: IUpdate) => dispatch(updateCostPrice(payload)),
    updateCostPriceCurrency: (payload: IUpdateCurrency) => dispatch(updateCostPriceCurrency(payload)),
    updateCostPriceCurrencyValue: (payload: IUpdate) => dispatch(updateCostPriceCurrencyValue(payload)),
    updateSalePrice: (payload: IUpdate) => dispatch(updateSalePrice(payload)),
    updateSalePriceCurrency: (payload: IUpdateCurrency) => dispatch(updateSalePriceCurrency(payload)),
    updateSalePriceCurrencyValue: (payload: IUpdate) => dispatch(updateSalePriceCurrencyValue(payload)),
    updateMargin: (payload: IUpdate) => dispatch(updateMargin(payload)),
    updateMarkup: (payload: IUpdate) => dispatch(updateMarkup(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
