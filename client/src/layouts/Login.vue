<template>
  <div style="font-family: 'Actor'" class="q-pa-md row paper-wrap">
    <div class="col-lg-4 col-sm-8 ">
      <div @click="go('/')" class="cursor-pointer col-12 flex q-mb-md justify-center">
        <q-img src="logo.png" alt=""  style="width: 150px"/>
      </div>
      <q-card class="col-10 q-pa-md q-mx-auto">
        <q-tabs
          v-model="tab"
          shrink stretch
          align="justify"
        >
          <q-tab @click="resetField" style="font-family: 'Actor'" name="login" label="ALREADY REGISTERED?" />
          <q-tab @click="resetField" style="font-family: 'Actor'" name="signup" label="YOU'RE NEW?" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated>

          <q-tab-panel class="col-12 row"  style="min-height: 50vh" name="login">
            <div class="text-h6 col-12 text-center" style="font-weight: bold; ">LOGIN WITH EMAIL</div>

            <div class="text-h6 col-md-8 q-mx-auto">

              <q-input outlined class="q-pt-lg" color="dark" v-model="user.email" label="Email address">
                <template v-slot:prepend>
                  <q-icon name="account_circle" />
                </template>
              </q-input>
              <q-input outlined class="q-pt-lg" color="dark" label="Password" v-model="user.password"
                       :type="isPwd ? 'password' : 'text'">
                <template v-slot:prepend>
                  <q-icon name="vpn_key" />
                </template>
                <template v-slot:append>
                  <q-icon
                    v-if="user.password!==''"
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <div class="flex justify-center">
                <q-btn @click="onLogin" outline color="primary"
                       class="q-my-sm q-px-xl q-py-xs text-body1" label="Login" />
              </div>
            </div>
            <q-separator class="q-my-sm"/>
            <div class="col-12">
              <div class="text-h6 col-12 text-center" style="font-weight: bold; ">OR LOGIN WITH...</div>
              <div class="col-12 flex justify-center q-mt-sm">
                <div @click="loginWithGG"
                  class="other-auth q-ml-xs q-mr-xs q-pa-sm flex items-center text-subtitle1">
                  <q-img class="q-mr-md q-ml-sm"
                         src="https://my.asos.com/Content/images/logo-googleg-48-dp.svg" width="15px"/>
                  Google
                </div>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel class="col-12 row" style="min-height: 50vh" name="signup">
            <div class="text-h6 col-12 text-center" style="font-weight: bold; ">SIGN UP USING YOUR EMAIL ADDRESS</div>

            <div class="text-h6 col-md-8 q-mx-auto">

              <q-input outlined class="q-pt-lg" color="primary" v-model="user.email" label="Email address">
                <template v-slot:prepend>
                  <q-icon name="account_circle" />
                </template>
              </q-input>
              <q-input outlined class="q-pt-lg" color="primary" v-model="user.fullName" label="First name">
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
              <q-input outlined class="q-pt-lg" color="primary" label="Password" v-model="user.password"
                       :type="isPwd ? 'password' : 'text'">
                <template v-slot:prepend>
                  <q-icon name="vpn_key" />
                </template>
                <template v-slot:append>
                  <q-icon
                    v-if="user.password !==''"
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <div class="flex justify-center">
                <q-btn outline color="primary"
                       @click="SignUp"
                       class="q-my-sm q-px-xl q-py-xs text-body1" label="Sign Up" />
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import {myFirebase, myFirestore} from "boot/firebase";

export default {
  name: "Login",
  data () {
    return {
      tab: 'login',
      user: {},
      isPwd: true,
      showLoading: false,
    }
  },
  mounted() {
  },
  watch: {
    error() {
      if (this.error) {
        this.$q.notify({
          message: this.error,
          icon: 'error',
          type: 'negative',
          timeout: 500,
          position: 'top-right'
        })
      }
    }
  },
  methods: {
    resetField() {
      this.password = '';
      this.email = '';
      this.fullName = '';
      this.isPwd = true;
      this.classOption = '';
    },
    go (url) {
      if (this.$route.path !== url) {
        this.$router.replace(url)
      }
    },
    async loginWithGG() {
      var ggProvider = new myFirebase.auth.GoogleAuthProvider();
      await myFirebase.auth().signInWithPopup(ggProvider)
      .then(data => {
        if (data.user) {
          localStorage.setItem('firebaseToken',data.credential.idToken)
          localStorage.setItem('userID', data.user.uid)
          return myFirestore.collection('users')
          .add({
            email: data.user.email,
            fullName: data.user.displayName
          })
          .then(() => {
            this.$q.notify({
              message: 'Login success!',
              type: 'positive',
              timeout: 500,
              position: 'top-right'
            })
            return this.$router.replace('/')
          })
          .catch(err => {
            this.$q.notify({
              message: err.code,
              icon: 'error',
              type: 'negative',
              timeout: 500,
              position: 'top-right'
            })
          })
        }
        else {
          this.$q.notify({
            message: err.code,
            icon: 'error',
            type: 'negative',
            timeout: 500,
            position: 'top-right'
          })
        }
      })
      .catch(err => {
        this.$q.notify({
          message: err.code,
          icon: 'error',
          type: 'negative',
          timeout: 500,
          position: 'top-right'
        })
      })
    },
    async onLogin() {
      this.$q.loading.show({
        message: 'Login....'
      })
      if (this.user.email && this.user.password) {
        await myFirebase.auth().signInWithEmailAndPassword(this.user.email, this.user.password)
        .then(data => {
          return myFirebase.auth().currentUser.getIdToken()
            .then(token => {
              this.$q.notify({
                message: 'Login success!',
                type: 'positive',
                timeout: 500,
                position: 'top-right'
              })
              localStorage.setItem('firebaseToken', token)
              localStorage.setItem('userID', data.user.uid)
              return this.$router.replace('/')
            })
            .catch(err => {
              this.$q.notify({
                message: err.code,
                icon: 'error',
                type: 'negative',
                timeout: 500,
                position: 'top-right'
              })
            })
        })
        .catch(err => {
          this.$q.notify({
            message: err.code,
            icon: 'error',
            type: 'negative',
            timeout: 500,
            position: 'top-right'
          })
        })
      }
      else {
        this.$q.notify({
          message: 'Field can not be empty!',
          icon: 'error',
          type: 'negative',
          timeout: 500,
          position: 'top-right'
        })
      }
      this.$q.loading.hide()
    },
    async SignUp() {
      await this.$q.loading.show()
      if (this.user.email && this.user.password && this.user.fullName) {
        await myFirebase.auth().createUserWithEmailAndPassword(this.user.email, this.user.password)
          .then((data) => {
            this.$q.notify({
              message: 'Sign up success.. Please login!',
              type: 'positive',
              timeout: 500,
              position: 'top-right'
            })
            return
          })
        .then(() =>{
            return myFirestore.collection('users')
            .add({
              email: this.user.email,
              fullName: this.user.fullName
            })
          .then(() => {
            return
          })
        })
        .catch(err => {
          this.$q.notify({
            message: err.code,
            icon: 'error',
            type: 'negative',
            timeout: 500,
            position: 'top-right'
          })
        })
      }
      else {
        this.$q.notify({
          message: 'Field can not be empty!',
          icon: 'error',
          type: 'negative',
          timeout: 500,
          position: 'top-right'
        })
      }
      await this.$q.loading.hide()
    }
  }
}
</script>

<style scoped>
#header-login {
  font-family: 'Alatsi';
  font-weight: bold;
  text-align: center;
  color: blue;
}
.center-element {
  margin: 0 auto;
}
.other-auth {
  border: 2px solid lightgrey;
  cursor: pointer;
}
.other-auth:hover {
  background-color: #F0F0F0;
}
.paper-wrap {
  background-color: #EEEEEE;
  width: 100%;
  overflow: auto;
  position: fixed;
  top: 0;
  height: 100%;
  display: flex;
  justify-content: center;
}
</style>
