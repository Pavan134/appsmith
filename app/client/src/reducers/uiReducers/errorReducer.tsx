import { createReducer } from "utils/ReducerUtils";
import type {
  ReduxAction,
  ReduxActionErrorPayload,
} from "ee/constants/ReduxActionConstants";
import { ReduxActionTypes } from "ee/constants/ReduxActionConstants";
import type { ERROR_CODES } from "ee/constants/ApiConstants";
import _ from "lodash";

const initialState: ErrorReduxState = {
  safeCrash: false,
  safeCrashCode: undefined,
  currentError: { sourceAction: "", message: "", stackTrace: "" },
};

const errorReducer = createReducer(initialState, {
  [ReduxActionTypes.SAFE_CRASH_APPSMITH]: (
    state: ErrorReduxState,
    action: ReduxAction<ReduxActionErrorPayload>,
  ) => ({
    ...state,
    safeCrash: true,
    safeCrashCode: _.get(action, "payload.code"),
  }),
  [ReduxActionTypes.REPORT_ERROR]: (
    state: ErrorReduxState,
    action: ReduxAction<ReduxActionErrorPayload>,
  ) => {
    return {
      ...state,
      currentError: {
        sourceAction: action.payload.source,
        message: action.payload.message,
        stackTrace: action.payload.stackTrace,
      },
    };
  },
  [ReduxActionTypes.FLUSH_ERRORS]: () => {
    return initialState;
  },
});

export interface ErrorReduxState {
  safeCrash: boolean;
  safeCrashCode?: ERROR_CODES;
  currentError: {
    sourceAction?: string;
    message?: string;
    stackTrace?: string;
  };
}

export default errorReducer;
