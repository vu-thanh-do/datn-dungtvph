import type { CustomFlowbiteTheme } from 'flowbite-react'

const flowbiteTheme: CustomFlowbiteTheme = {
  badge: {
    root: {
      color: {
        primary:
          'bg-primary-100 text-primary-800 dark:bg-primary-200 dark:text-primary-800 group-hover:bg-primary-200 dark:group-hover:bg-primary-300'
      },
      size: {
        xl: 'px-3 py-2 text-base rounded-md'
      }
    },
    icon: {
      off: 'rounded-full px-2 py-1'
    }
  },
  button: {
    color: {
      primary:
        'text-white bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
    },
    outline: {
      on: 'transition-all duration-75 ease-in group-hover:bg-opacity-0 group-hover:text-inherit'
    },
    size: {
      md: 'text-sm px-3 py-2'
    }
  },
  dropdown: {
    arrowIcon: 'ml-2 h-4 w-5 text-black dark:text-white',
    floating: {
      base: 'z-10 w-fit rounded-xl divide-y divide-gray-100 shadow',
      content: 'rounded-xl text-sm text-gray-700 dark:text-gray-200',
      target: 'w-fit dark:text-white',
      item: {
        icon: 'mr-2 h-5 w-5'
      }
    },
    content: 'p-2'
  },
  modal: {
    content: {
      inner: 'relative rounded-lg bg-white shadow dark:bg-gray-800'
    },
    header: {
      base: 'flex items-start justify-between rounded-t px-5 pt-5'
    }
  },
  navbar: {
    root: {
      base: 'fixed z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700'
    }
  },
  sidebar: {
    root: {
      base: 'flex fixed top-0 left-0 z-20 flex-col flex-shrink-0 pt-16 h-full duration-75 border-r border-gray-200 lg:flex transition-width dark:border-gray-700',
      inner: 'h-full overflow-y-auto hidden-scroll-bar overflow-x-hidden bg-gray-50 py-4 px-3 dark:bg-gray-800'
    },
    item: {
      base: 'flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-[#2563EB]',
      icon: {
        base: 'h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-white dark:group-hover:text-white'
      }
    },

    collapse: {
      button:
        'group flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700',
      icon: {
        base: 'h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-white dark:group-hover:text-white ',
        open: {
          off: '',
          on: 'text-gray-900'
        }
      },
      label: {
        base: 'ml-3 flex-1 whitespace-nowrap text-left'
      }
    }
  },
  textarea: {
    base: 'block w-full text-sm p-4 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50'
  },
  toggleSwitch: {
    toggle: {
      checked: {
        off: '!border-gray-200 !bg-gray-200 dark:!border-gray-600 dark:!bg-gray-700'
      }
    }
  },
  tab: {
    tablist: {
      base: 'flex text-center',
      styles: {
        default: 'flex-wrap border-b border-gray-200 dark:border-gray-700',
        underline: 'flex-wrap -mb-px border-b border-gray-200 dark:border-gray-700',
        pills: 'flex-wrap font-medium text-sm text-gray-500 dark:text-gray-400 space-x-2',
        fullWidth:
          'w-full text-sm font-medium divide-x divide-gray-200 shadow grid grid-flow-col dark:divide-gray-700 dark:text-gray-400 rounded-none'
      },
      tabitem: {
        base: 'flex items-center justify-center p-4 rounded-t-lg text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 focus:ring-4 focus:ring-cyan-300 focus:outline-none',
        styles: {
          default: {
            base: 'rounded-t-lg',
            active: {
              on: 'bg-gray-200 text-[#2EA1BD] dark:bg-gray-800 dark:text-cyan-500 !outline-none !border-none',
              off: 'text-gray-500 hover:bg-gray-50 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800  dark:hover:text-gray-300'
            }
          },
          underline: {
            base: 'rounded-t-lg',
            active: {
              on: 'text-cyan-600 rounded-t-lg border-b-2 border-cyan-600 active dark:text-cyan-500 dark:border-cyan-500',
              off: 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300'
            }
          },
          pills: {
            base: '',
            active: {
              on: 'rounded-lg bg-cyan-600 text-white',
              off: 'rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white'
            }
          },
          fullWidth: {
            base: 'ml-0 first:ml-0 w-full rounded-none flex',
            active: {
              on: 'p-4 text-gray-900 bg-gray-100 active dark:bg-gray-700 dark:text-white rounded-none',
              off: 'bg-white hover:text-gray-700 hover:bg-gray-50 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700 rounded-none'
            }
          }
        },
        icon: 'mr-2 h-5 w-5'
      }
    },
    tabpanel: 'py-3'
  },
  pagination: {
    pages: {
      base: 'xs:mt-0 mt-2 inline-flex items-center -space-x-px',
      previous: {
        base: 'transition-all ml-0 rounded-l-lg border border-gray-300 bg-white py-3 px-3 leading-tight text-gray-500 enabled:hover:bg-blue-700 enabled:hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-blue-700 enabled:dark:hover:text-white'
      },
      next: {
        base: 'transition-all rounded-r-lg border border-gray-300 bg-white py-3 px-3 leading-tight text-gray-500 enabled:hover:bg-blue-700 enabled:hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-blue-700 enabled:dark:hover:text-white'
      },
      selector: {
        base: 'w-12 border border-gray-300 bg-white py-3 select-none leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white',
        active: 'bg-blue-700 text-white dark:bg-blue-700 dark:text-white',
        disabled: 'opacity-50 cursor-not-allowed'
      }
    }
  }
}

export default flowbiteTheme
