import { connect, Dispatch } from "react-redux";
import { IProps, Form } from "../components/Form";
import { IStoreState, IUpdateMargin, updateMargin } from "../store";

export function mapStateToProps({ margin }: IStoreState): IProps {
  return { margin };
}

export function mapDispatchToProps(dispatch: Dispatch<any>): IProps {
  return {
    updateMargin: (payload: IUpdateMargin) => dispatch(updateMargin(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
