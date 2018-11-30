// import { stopAndPrevent } from '../../utils/event.js'

export default {
  props: {
    filter: String,
    filterDebounce: {
      type: [Number, String],
      default: 300
    },

    loading: {
      type: Boolean,
      default: null
    }
  },

  computed: {
    hasInput () {
      return this.filter !== void 0
    }
  },

  methods: {
    __getInput (h) {
      return h('input', {
        staticClass: 'q-select__filter col',
        domProps: { value: this.filter },
        on: {
          input: this.__onInputValue,
          click: this.__onInputClick,
          focus: this.__onInputFocus,
          blur: this.__onInputBlur
        }
      })
    },

    __onInputValue (e) {
      console.log('__onInputValue')
      clearTimeout(this.filterTimer)

      this.filterTimer = setTimeout(() => {
        const val = e.target.value

        if (this.filter !== val) {
          this.triggerFilter(val)
        }
      }, this.filterDebounce)
    },

    __onInputClick (e) {
      // console.log('__onInputClick', this.loading)
      // stopAndPrevent(e)
      // this.loading === null && this.$refs.menu.show()
    },

    __onInputFocus (e) {
      console.log('__onInputFocus')
      // stopAndPrevent(e)
      this.__onFocus(e)
      // this.focused = true
      this.triggerFilter(e.target.value)
    },

    __onInputBlur (e) {
      console.log('__onInputBlur')
      this.__onBlur(e)

      if (this.filter !== '') {
        this.$emit('update:filter', '')
      }
    },

    triggerFilter (val) {
      console.log('__triggerFilter')
      this.$emit('update:filter', val)
      console.log('__triggerFilter - before emit')
      this.$emit('filter', val)
      console.log('__triggerFilter - after emit')

      this.$nextTick(() => {
        if (this.loading !== true) {
          // this.$refs.menu.show()
        }
        else {
          const fn = loading => {
            if (loading === false) {
              // this.$refs.menu.show()
              this.unWatchLoading()
              this.unWatchLoading = void 0
            }
          }
          this.unWatchLoading = this.$watch('loading', fn)
        }
      })
    }
  },

  beforeDestroy () {
    this.unWatchLoading !== void 0 && this.unWatchLoading()
    clearTimeout(this.filterTimer)
  }
}