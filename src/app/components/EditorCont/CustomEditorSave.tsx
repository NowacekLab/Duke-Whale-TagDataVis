import React, {Component} from 'react';
import {
  Flaglist,
  ColorPicker,
  ColorscalePicker,
  PlotlyFold,
  PanelMenuWrapper,
  TextEditor,
  Radio,
  Dropdown,
  Info,
  PlotlySection,
  Numeric,
  LayoutPanel,
  Button,
  SingleSidebarItem,
  TraceAccordion,
} from 'react-chart-editor';

export default class CustomEditor extends Component {
  render() {
    return (
        <SingleSidebarItem name="placeholder">
          <Button variant="primary" label="save" onClick={() => alert('save button clicked!')} />
        </SingleSidebarItem>
    );
  }
}