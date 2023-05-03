import { Dropdown } from './components/dropdown';
import { Select } from './components/select';

document.querySelectorAll('.dropdown').forEach(el => new Dropdown(el as HTMLElement));
document.querySelectorAll('select').forEach(el => new Select(el))