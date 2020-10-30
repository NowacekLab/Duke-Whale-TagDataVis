import pandas as pd
import csv
import dash
import dash_html_components as html
import dash_core_components as dcc
from dash.dependencies import Input, Output

df = pd.read_csv('mn17_005aprh25.mat.csv')

xData = list(range(32, 232))
yData = df['Heading'].tolist()[32:232]

app = dash.Dash('Dash app whale pitch data')
text_style = dict(color='#444', fontFamily='sans-serif', fontWeight=300)

Heading_figure = dict(data=[dict(x=xData, y=yData)], name='Heading Over Time', layout=dict(
            title='Heading Over Time',
            legend=dict(
                x=0,
                y=1.0
            ),
            margin=dict(l=40, r=0, t=40, b=30)
        ))
PitchRoll = dict(
        data=[
            dict(
                x=xData,
                y=df['Pitch'].tolist()[32:232],
                name='Pitch',
                marker=dict(
                    color='rgb(55, 83, 109)'
                )
            ),
            dict(
                x=xData,
                y=df['Roll'].tolist()[32:232],
                name='Roll',
                marker=dict(
                    color='rgb(26, 118, 255)'
                )
            )
        ],
        layout=dict(
            title='Pitch & Roll Over Time',
            showlegend=True,
            legend=dict(
                x=0,
                y=1.0
            ),
            margin=dict(l=40, r=0, t=40, b=30)
        )
    )
XAcc_figure = dict(data=[dict(x=xData, y=df['Accel_X'].tolist()[32:232])], name='Acceleration in the X Direction', layout=dict(
            title='Acceleration in the X Direction',
            legend=dict(
                x=0,
                y=1.0
            ),
            margin=dict(l=40, r=0, t=40, b=30)
        ))
YAcc_figure = dict(data=[dict(x=xData, y=df['Accel_Y'].tolist()[32:232])], name='Acceleration in the Y Direction', layout=dict(
            title='Acceleration in the Y Direction',
            legend=dict(
                x=0,
                y=1.0
            ),
            margin=dict(l=40, r=0, t=40, b=30)
        ))

ZAcc_figure = dict(data=[dict(x=xData, y=df['Accel_Z'].tolist()[32:232])], name='Acceleration in the Z Direction', layout=dict(
            title='Acceleration in the Z Direction',
            legend=dict(
                x=0,
                y=1.0
            ),
            margin=dict(l=40, r=0, t=40, b=30)
        ))

app.layout = html.Div([ 
        html.H2('2-Dimensional Data', style=text_style),
        html.P('Pick the axes for the visualization.', style=text_style),
        dcc.Dropdown(
    options=[
        {'label': 'M', 'value': 'M'},
        {'label': 'Mw', 'value': 'Mw'},
        {'label': 'p', 'value': 'p'},
        {'label': 'pitch', 'value': 'pitch'},
        {'label': 'roll', 'value': 'roll'},
        {'label': 'T', 'value': 't'}
    ],
    value='X'
),
        dcc.Dropdown(
    options=[
        {'label': 'M', 'value': 'M'},
        {'label': 'Mw', 'value': 'Mw'},
        {'label': 'p', 'value': 'p'},
        {'label': 'pitch', 'value': 'pitch'},
        {'label': 'roll', 'value': 'roll'},
        {'label': 'T', 'value': 't'}
    ],
    value='X'
),
        dcc.Input(id='text1', placeholder='box', value=''),
        dcc.Graph(id='plot1', figure=Heading_figure),
        dcc.Graph(
    figure= PitchRoll,
    style={'height': 300},
    id='my-graph'
),
        dcc.Graph(
    figure= XAcc_figure,
    style={'height': 300},
    id='x-accel'
),
        dcc.Graph(
    figure= YAcc_figure,
    style={'height': 300},
    id='y-accel'
),
        dcc.Graph(
    figure= ZAcc_figure,
    style={'height': 300},
    id='Z-accel'
)  
    ])

@app.callback(Output('plot1', 'figure'), [Input('X', 'value')] )
def text_callback( text_input ):
    return {'data': [dict(x, y, type=text_input)]}

app.server.run()
