import {
  Button,
  Dialog,
  Pagination,
  Tooltip,
  Select,
  Option,
  Autocomplete,
  Notification,
  Message,
  MessageBox,
  Form,
  FormItem,
  Badge,
  Input,
  Switch
} from 'element-ui'
import './element-variables.scss'

export default {
  install(V) {
    V.use(Button)
    V.use(Dialog)
    V.use(Pagination)
    V.use(Tooltip)
    V.use(Select)
    V.use(Option)
    V.use(Autocomplete)
    V.use(Form)
    V.use(FormItem)
    V.use(Badge)
    V.use(Input)
    V.use(Switch)
    V.prototype.$notify = Notification
    V.prototype.$confirm = MessageBox.confirm
    V.prototype.$message = Message
  }
}