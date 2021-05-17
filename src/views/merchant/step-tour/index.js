import 'driver.js/dist/driver.min.css'
import Driver from 'driver.js'

const driver = new Driver({
  onDeselected: (Element) => {
    console.log('onDeselected')
  }
})

export const steps = [
  {
    element: '#warehouse',
    popover: {
      className: 'first-step-popover-class',
      title: 'Title on Popover',
      description: 'Body of the popover',
      position: 'bottom'
    }
  },
  {
    element: '#import',
    popover: {
      className: 'first-step-popover-class',
      title: 'Title on Popover',
      description: 'Body of the popover',
      position: 'bottom'
    }
  },
  {
    element: '#reset',
    popover: {
      className: 'first-step-popover-class',
      title: 'Title on Popover',
      description: 'Body of the popover',
      position: 'bottom'
    }
  },
  {
    element: '#close',
    popover: {
      className: 'first-step-popover-class',
      title: 'Title on Popover',
      description: 'Body of the popover',
      position: 'bottom'
    }
  },
  {
    element: '.associatedPoi',
    popover: {
      className: 'first-step-popover-class',
      title: 'Title on Popover',
      description: 'Body of the popover',
      position: 'bottom'
    }
  },
  {
    element: '.delete-operation',
    popover: {
      className: 'first-step-popover-class',
      title: 'Title on Popover',
      description: 'Body of the popover',
      position: 'left'
    }
  }
]

export default driver
