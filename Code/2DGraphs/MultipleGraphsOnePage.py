#!/usr/bin/env python
# coding: utf-8

# In[27]:


from plotly.subplots import make_subplots
import plotly.graph_objects as go
import pandas as pd
import csv


# In[36]:


df = pd.read_csv('mn17_005aprh25.mat.csv') 


# In[37]:


startIndex = 32
endIndex = 10000


# In[38]:


xAxis = list(range(startIndex, endIndex))
headData = df.Heading[startIndex:endIndex]


# In[77]:


plots = make_subplots(rows=3, cols=2, 
                      subplot_titles=("Heading", "Pitch", 
                                      "X Acceleration", "Roll", "Y Acceleration", "Z Acceleration"))


# In[78]:


plots.add_trace(
    go.Scatter(x=xAxis, y=headData, name = "heading"),
    row=1, col=1
)


# In[79]:


pitchData = df.Pitch[startIndex:endIndex]
rollData = df.Roll[startIndex:endIndex]


# In[80]:


plots.add_trace(
    go.Scatter(x=xAxis, y=pitchData, name = "pitch"),
    row=1, col=2
)


# In[81]:


xAccelerationData = df["Accel_X"][startIndex:endIndex]


# In[82]:


plots.add_trace(
    go.Scatter(x=xAxis, y=xAccelerationData, name = "x-acceleration"),
    row=2, col=1
)


# In[83]:


plots.add_trace(
    go.Scatter(x=xAxis, y=rollData, name = "roll"),
    row=2, col=2
)


# In[84]:


yAccelerationData = df["Accel_Y"][startIndex:endIndex]


# In[85]:


plots.add_trace(
    go.Scatter(x=xAxis, y=yAccelerationData, name = "y-acceleration"),
    row=3, col=1
)


# In[86]:


zAccelerationData = df["Accel_Z"][startIndex:endIndex]


# In[87]:


plots.add_trace(
    go.Scatter(x=xAxis, y=zAccelerationData, name = "z-acceleration"),
    row=3, col=2
)


# In[92]:


plots.update_layout(height = 1500, width=1500, title_text="2D Plots")
plots.show()


# In[93]:


plots.write_html('2Dplots.html', auto_open=True)


# In[ ]:




