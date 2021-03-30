import _plotly_utils.basevalidators


class Xperiod0Validator(_plotly_utils.basevalidators.AnyValidator):
    def __init__(self, plotly_name="xperiod0", parent_name="ohlc", **kwargs):
        super(Xperiod0Validator, self).__init__(
            plotly_name=plotly_name,
            parent_name=parent_name,
            edit_type=kwargs.pop("edit_type", "calc"),
            role=kwargs.pop("role", "info"),
            **kwargs
        )
