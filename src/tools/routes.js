import VueRouter from 'vue-router'
import Login from '../components/admin/login'
import Index from '../components/index/index'
import SystemIndex from '../components/indexMan/systemIndex/systemIndex'
import Account from '../components/indexMan/account/account'
import SystemInfo from '../components/indexMan/systemInfo/systemInfo'
import AddressList from '../components/communicationMan/addressList/addressList'
import Temporary from '../components/communicationMan/temporary/temporary'
import SMSRS from '../components/smsMan/smsRS/smsRS'
import SMSTemplate from '../components/smsMan/smsTemplate/smsTemplate'
import Tag from '../components/smsMan/tag/tag'
import TacticsTemplate from '../components/businessMan/tacticsTemplate/tacticsTemplate'
import BPlan from '../components/businessMan/bPlan/bPlan'
import PlanLog from '../components/logMan/planLog/planLog'
import SystemLog from '../components/logMan/systemLog/systemLog'
import EarlyLog from '../components/logMan/earlyLog/earlyLog'
import SystemProject from '../components/indexMan/SystemProject/SystemProject'
import SystemProjectSF from '../components/indexMan/SystemProject/SystemProjectSF'
import SystemCase from '../components/indexMan/SystemCase/SystemCase'
import FormList from '../components/indexMan/formList/formList'
import FormInput from '../components/indexMan/formInput/formInput'
import FormSearch from '../components/indexMan/formSearch/formSearch'



const router = new VueRouter({
  routes: [
    {
      path: '/', // 默认页面重定向到主页
      redirect: '/Login'
    },
    {
      path: '/Login',
      component: Login,
    },
    {
      path: '/',
      component: Index,
      children: [
        { path: 'SystemIndex', component: SystemIndex },
        { path: 'Account', component: Account },
        { path: 'SystemInfo', component: SystemInfo },
        { path: 'AddressList', component: AddressList },
        { path: 'Temporary', component: Temporary },
        { path: 'SMSRS', component: SMSRS },
        { path: 'SMSTemplate', component: SMSTemplate },
        { path: 'Tag', component: Tag },
        { path: 'TacticsTemplate', component: TacticsTemplate },
        { path: 'BPlan', component: BPlan },
        { path: 'PlanLog', component: PlanLog },
        { path: 'SystemLog', component: SystemLog },
        { path: 'EarlyLog', component: EarlyLog },
        { path: 'FormList', component: FormList },
        { path: 'SystemProject', component: SystemProject },
        { path: 'SystemProjectSF', component: SystemProjectSF },
        { path: 'SystemCase', component: SystemCase },
        { path: 'SystemInput', component: FormInput },
        { path: 'SystemSearch', component: FormSearch },
      ]
    }
  ]
});
router.beforeEach((to, from, next) => {
  if (to.fullPath !== '/Login') {
    if (!sessionStorage.getItem("token")) {
      next({
        path: '/Login',
      })
    } else {
      next()
    }
  } else {
    next()
  }
});
export default router;