import Vue from 'vue'
import date from './date'
import duration from './duration'
import capacity from './capacity'

Vue.filter('datetime', date)
Vue.filter('duration', duration)
Vue.filter('capacity', capacity)
