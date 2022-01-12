import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPhone,faBars } from "@fortawesome/free-solid-svg-icons";

library.add(faPhone);
library.add(faBars);


import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

createApp(App)
    .use(router)
    .component("font-awesome-icon", FontAwesomeIcon)
    .mount('#app')