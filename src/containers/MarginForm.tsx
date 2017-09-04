import { connect, Dispatch } from "react-redux";
import { IPropsState, IPropsDispatch, MarginForm } from "../components/MarginForm";
import { IStoreState } from "../store";
import {
  IUpdate,
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
  updateDiscount,
} from "../store/marginCalculator";

function mapStateToProps({ currencyRates, marginCalculator }: IStoreState): IPropsState {
  return { currencyRates, marginCalculator };
}

function mapDispatchToProps(dispatch: Dispatch<any>): IPropsDispatch {
  return {
    reset: () => dispatch(reset(undefined)),
    recalculate: () => dispatch(recalculate(undefined)),
    updateCostPrice: (payload: IUpdate) => dispatch(updateCostPrice(payload)),
    updateCostPriceCurrency: (payload: IUpdate) => dispatch(updateCostPriceCurrency(payload)),
    updateCostPriceCurrencyValue: (payload: IUpdate) => dispatch(updateCostPriceCurrencyValue(payload)),
    updateSalePrice: (payload: IUpdate) => dispatch(updateSalePrice(payload)),
    updateSalePriceCurrency: (payload: IUpdate) => dispatch(updateSalePriceCurrency(payload)),
    updateSalePriceCurrencyValue: (payload: IUpdate) => dispatch(updateSalePriceCurrencyValue(payload)),
    updateMargin: (payload: IUpdate) => dispatch(updateMargin(payload)),
    updateMarkup: (payload: IUpdate) => dispatch(updateMarkup(payload)),
    updateDiscount: (payload: IUpdate) => dispatch(updateDiscount(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MarginForm);
