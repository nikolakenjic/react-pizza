import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom'
import { createOrder } from '../../services/apiRestaurant'
import Button from '../../ui/Button'
import { fetchAddress, getUsername } from '../user/userSlice'
import { clearCart, getCart, getTotalCartPrice } from '../cart/cartSlice'
import EmptyCart from '../cart/EmptyCart'
import store from '../../store'
import { formatCurrency } from '../../utils/helpers'

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  )

function CreateOrder() {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const {
    username,
    status: addressStatus,
    error: errorAddress,
    position,
    address,
  } = useSelector((state) => state.user)

  const isLoadingAddress = addressStatus === 'loading'
  const isSubmitting = navigation.state === 'submitting'

  const [withPriority, setWithPriority] = useState(false)

  const totalCartPrice = useSelector(getTotalCartPrice)
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0
  const totalPrice = totalCartPrice + priorityPrice

  const formErrors = useActionData()

  const cart = useSelector(getCart)

  if (!cart.length) return <EmptyCart />

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

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="text-sm italic sm:basis-40 md:text-base">
            Address
          </label>
          <div className="grow">
            <input
              type="text"
              name="address"
              required
              className="input w-full"
              disabled={isLoadingAddress}
              defaultValue={address}
            />
            {addressStatus === 'error' && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {errorAddress}
              </p>
            )}
          </div>
          {!position.latitude && !position.longitude && (
            <span className="top-[3px] z-10 sm:absolute sm:right-1 md:top-[5px]">
              <Button
                disabled={isLoadingAddress}
                type="small"
                onClick={() => dispatch(fetchAddress())}
              >
                Get position
              </Button>
            </span>
          )}
        </div>

        <div className="mt-8">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="mr-2 h-4 w-4 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="text-sm sm:text-base">
            Want to yo give your order priority?
          </label>
        </div>

        <div className="mt-12">
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.longitude && position.latitude
                ? `${position.latitude},${position.longitude}`
                : ''
            }
          />

          <Button disabled={isSubmitting || isLoadingAddress} type="primary">
            {isSubmitting
              ? 'Place order...'
              : `${formatCurrency(totalPrice)}, Order now`}
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
    priority: data.priority === 'true',
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

  // Reset cart to empty
  store.dispatch(clearCart())

  return redirect(`/order/${newOrder.id}`)
  // return null
}

export default CreateOrder
