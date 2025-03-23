import { Injectable } from "@nestjs/common";
import { InjectTemporalClient } from "nestjs-temporal";
import { WorkflowClient } from '@temporalio/client';

@Injectable()
export class CartService {
    constructor(
        @InjectTemporalClient() private readonly temporalClient: WorkflowClient,
    ) { }

    async addToCart(userId: string, productId: string, quantity: number) {
        const workflowId = `add-to-cart-${userId}-${Date.now()}`;
        
        const handle = await this.temporalClient.start('addToCartWorkflow', {
            args: [{ userId, productId, quantity }],
            taskQueue: 'staging',
            workflowId,
        });

        const result =  handle.result();
        return result;
    }

    async getCart(userId: string) {
        const workflowId = `get-cart-${userId}-${Date.now()}`;
        
        const handle = await this.temporalClient.start('getCartWorkflow', {
            args: [{ userId }],
            taskQueue: 'staging',
            workflowId,
        });

        const result =  handle.result();
        return result;
    }

    async updateCartItem(userId: string, productId: string, quantity: number) {
        const workflowId = `update-cart-${userId}-${Date.now()}`;
        
        const handle = await this.temporalClient.start('updateCartWorkflow', {
            args: [{ userId, productId, quantity }],
            taskQueue: 'staging',
            workflowId,
        });

        const result = await handle.result();
        return result;
    }

    async removeFromCart(userId: string, productId: string) {
        const workflowId = `remove-from-cart-${userId}-${Date.now()}`;
        
        const handle = await this.temporalClient.start('removeFromCartWorkflow', {
            args: [{ userId, productId }],
            taskQueue: 'staging',
            workflowId,
        });

        const result = await handle.result();
        return result;
    }
}