import {
    AutoComplete,
    Cascader,
    Checkbox,
    DatePicker,
    Input,
    InputNumber,
    Mentions,
    Radio,
    Rate,
    Select,
    Slider,
    Switch,
    TimePicker,
    Transfer,
    TreeSelect,
    Upload
} from 'antd'

const CheckboxGroup = Checkbox.Group;

const MonthPicker = DatePicker.MonthPicker;
const QuarterPicker = DatePicker.QuarterPicker;
const DateRangePicker = DatePicker.RangePicker;
const DateTimePicker = DatePicker.TimePicker;
const WeekPicker = DatePicker.WeekPicker;
const YearPicker = DatePicker.YearPicker;

const InputGroup = Input.Group;
const Password = Input.Password;
const InputSearch = Input.Search;
const TextArea = Input.TextArea;

const RadioGroup = Radio.Group
const RadioButton = Radio.Button

const TimeRangePicker = TimePicker.RangePicker

import { GetWidgets } from "./formItemWrapper"

const internalWidgets: GetWidgets = (widget: string) => {
    const name = widget.toLowerCase();
    switch (name) {
        case 'autocomplete': 
            return AutoComplete;
        case 'cascader':
            return Cascader;
        case 'checkbox':
            return Checkbox;
        case 'checkboxgroup':
            return CheckboxGroup;
        case 'datepicker':
            return DatePicker;
        case 'monthpicker':
            return MonthPicker;
        case 'quarterpicker':
            return QuarterPicker;
        case 'daterangepicker':
            return DateRangePicker;
        case 'datetimepicker':
            return DateTimePicker;
        case 'yearpicker':
            return YearPicker;
        case 'weekpicker':
            return WeekPicker;
        case 'input': 
            return Input;
        case 'inputgroup':
            return InputGroup
        case 'password':
            return Password;
        case 'inputsearch':
            return InputSearch
        case "textarea":
            return TextArea
        case 'inputnumber': 
           return InputNumber;
        case 'mentions': 
            return Mentions;
        case 'radio':
            return Radio;
        case 'radiogroup':
            return RadioGroup;
        case 'radiobutton':
            return RadioButton;
        case 'rate':
            return Rate;
        case 'select': 
            return Select;
        case 'slider': 
            return Slider;
        case 'switch':
            return Switch;
        case 'timepicker': 
            return TimePicker;
        case 'timerangepicker': 
            return TimeRangePicker;
        case 'transfer':
            return Transfer
        case 'treeselect':
            return TreeSelect
        case 'upload':
            return Upload
        default:
            return null
    }
}

export default internalWidgets;