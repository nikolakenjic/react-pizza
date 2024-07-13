import { useState } from 'react'
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom'
import { createOrder } from '../../services/apiRestaurant'
import Button from '../../ui/Button'
import { useSelector } from 'react-redux'

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  )

const fakeCart = [
  {
    pizzaId: 12,
    name: 'Mediterranean',
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: 'Vegetale',
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: 'Spinach and Mushroom',
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
]

function CreateOrder() {
  const { username } = useSelector((state) => state.user)
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'
  // const [withPriority, setWithPriority] = useState(false);

  const formErrors = useActionData()

  const cart = fakeCart

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 font-semibold sm:text-xl">
        Ready to order? Let's go!
      </h2>

      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="text-sm italic sm:basis-40 md:text-base">
            First Name
          </label>
          <input
            type="text"
            name="customer"
            required
            className="input grow"
            defaultValue={username}
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="text-sm italic sm:basis-40 md:text-base">
            Phone number
          </label>
          <div className="grow">
            <input type="tel" name="phone" required className="input w-full" />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="text-sm italic sm:basis-40 md:text-base">
            Address
          </label>
          <div className="grow">
            <input
              type="text"
              name="address"
              required
              className="input w-full"
            />
          </div>
        </div>

        <div className="mt-8">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="mr-2 h-4 w-4 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="text-sm sm:text-base">
            Want to yo give your order priority?
          </label>
        </div>

        <div className="mt-12">
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />

          <Button disabled={isSubmitting} type="primary">
            {isSubmitting ? 'Place order...' : 'Order now'}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export async function action({ request }) {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'on',
  }

  // if have errors
  const errors = {}
  if (!isValidPhone(order.phone)) {
    errors.phone =
      'Please give us your correct number.We might need it to contact you.'
  }
  if (Object.keys(errors).length > 0) return errors

  // If everything is ok, create new order and redirect
  const newOrder = await createOrder(order)

  return redirect(`/order/${newOrder.id}`)
  // return null
}

export default CreateOrder
