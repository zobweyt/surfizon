import { Dropdown } from './components/dropdown';
import { ComboBox } from './components/combobox';

document.querySelectorAll('.dropdown').forEach(el => new Dropdown(el as HTMLElement));
document.querySelectorAll('select').forEach(el => new ComboBox(el))