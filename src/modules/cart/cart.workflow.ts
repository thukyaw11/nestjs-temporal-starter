import { proxyActivities, log, ActivityFailure, ApplicationFailure } from '@temporalio/workflow';
import { ICartActivity } from './cart.activity';



interface AddToCartArgs {
  userId: string;
  productId: string;
  quantity: number;
}

interface GetCartArgs {
  userId: string;
}

interface UpdateCartArgs {
  userId: string;
  productId: string;
  quantity: number;
}

interface RemoveFromCartArgs {
  userId: string;
  productId: string;
}

const cartActivities = {
  startToCloseTimeout: '10s',
  scheduleToCloseTimeout: '20s',
  retry: {
    initialInterval: '10s',
    maximumAttempts: 5,
  },
} as const;


const defaultActivity = {
  startToCloseTimeout: '5s',
  scheduleToCloseTimeout: '10s',
  retry: {
    initialInterval: '10s',
    maximumAttempts: 5,
  },
} as const;


// for long running processes
const longRunningActivity = {
  startToCloseTimeout: '10s',
  scheduleToCloseTimeout: '20s',
} as const;

interface Compensation {
  message: string;
  fn: () => Promise<void>;
}

const { addItemToCart, getCartItems, updateCartItem, removeCartItem, validateProduct } = 
  proxyActivities<ICartActivity>(defaultActivity);

export async function addToCartWorkflow(args: AddToCartArgs): Promise<any> {
  const { userId, productId, quantity } = args;
  const compensations: Compensation[] = [];
  
  try {
    const isValid = await validateProduct(productId, quantity);
    if (!isValid) {
      throw new Error('Product validation failed');
    }

    compensations.push({
      message: 'Compensating add to cart operation',
      fn: async () => {
        await removeCartItem(userId, productId);
      }
    });

    // Add item to cart
    const result = await addItemToCart(userId, productId, quantity);
    return result;
  } catch (err) {
    if (err instanceof ActivityFailure && err.cause instanceof ApplicationFailure) {
      log.error(err.cause.message);
    }
    throw err;
  }
}

export async function getCartWorkflow(args: GetCartArgs): Promise<any> {
  const { userId } = args;
  
  try {
    const cartItems = await getCartItems(userId);
    console.log(cartItems)
    return cartItems;
  } catch (err) {
    if (err instanceof ActivityFailure && err.cause instanceof ApplicationFailure) {
      log.error(err.cause.message);
    }
    throw err;
  }
}

export async function updateCartWorkflow(args: UpdateCartArgs): Promise<any> {
  const { userId, productId, quantity } = args;
  
  try {
    // Validate product availability
    const isValid = await validateProduct(productId, quantity);
    if (!isValid) {
      throw new Error('Product validation failed');
    }

    const result = await updateCartItem(userId, productId, quantity);
    return result;
  } catch (err) {
    if (err instanceof ActivityFailure && err.cause instanceof ApplicationFailure) {
      log.error(err.cause.message);
    }
    throw err;
  }
}

export async function removeFromCartWorkflow(args: RemoveFromCartArgs): Promise<any> {
  const { userId, productId } = args;
  
  try {
    const result = await removeCartItem(userId, productId);
    return result;
  } catch (err) {
    if (err instanceof ActivityFailure && err.cause instanceof ApplicationFailure) {
      log.error(err.cause.message);
    }
    throw err;
  }
}


async function compensate(compensations: Compensation[] = []) {

  console.log('compensations is working with length ', compensations.length)
  if (compensations.length > 0) {
    log.info('failures encountered during account opening - compensating');
    for (const comp of compensations) {
      try {
        log.error(comp.message);
        await comp.fn();
      } catch (err) {
        log.error(`failed to compensate: ${prettyErrorMessage('', err)}`, { err });
     }
    }
  }
}


function prettyErrorMessage(message: string, err?: any) {
  let errMessage = err && err.message ? err.message : '';
  if (err && err instanceof ActivityFailure) {
    errMessage = `${err.cause?.message}`;
  }
  return `${message}: ${errMessage}`;
}