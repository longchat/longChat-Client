import vue from 'vue';
import   "./css/index.css";

import template from './component/template';
import { router } from './js/route';

vue.config.devtools = true
vue.config.debug = true
router.start(template, '#template')
