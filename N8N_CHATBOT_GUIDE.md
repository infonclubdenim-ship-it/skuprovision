# Setting up the AI Chatbot with n8n

The SKU Vision Pro platform includes an AI Support widget that is pre-configured to communicate with an external webhook. You will use **n8n** to process these webhooks, fetch answers using an AI model (like OpenAI or Gemini), and return the response.

## Overview of the Flow
1. User types a message in the SKU Vision Pro chatbot widget.
2. The widget sends a POST request to your `NEXT_PUBLIC_N8N_WEBHOOK_URL`.
3. n8n receives the webhook, extracts the user's message, and passes it to an AI Agent.
4. The AI Agent generates a response (potentially querying a knowledge base or Supabase).
5. The Respond to Webhook node sends the answer back to the frontend.

## Step 1: Create the Webhook Node in n8n
1. Create a new Workflow in n8n.
2. Add a **Webhook** node.
   - Set HTTP Method to `POST`.
   - Set Path to something like `sku-chatbot`.
   - Set Respond to `Using 'Respond to Webhook' Node` (This is critical!).
   - Copy the **Production URL**.

## Step 2: Add the AI Agent
1. Add an **AI Agent** node connected to the Webhook node.
2. Set the Agent Type to *Conversational Agent* or *React Agent*.
3. Add a **Language Model** (e.g., OpenAI Chat Model, Google Gemini) to the Agent.
   - Configure credentials for your chosen API.
4. Add a **Window Buffer Memory** node to the Agent so it remembers the chat context.
   - For Session ID, map it to `{{$json.body.sessionId}}` (The frontend sends a unique sessionId).
5. Add a **System Prompt**:
   - *"You are a helpful customer support assistant for SKU Vision Pro..."*
   - Map the user's input message to the Agent input: `{{$json.body.message}}`.

## Step 3: Respond to the Webhook
1. Connect a **Respond to Webhook** node after the AI Agent.
2. Set Respond With to `JSON`.
3. Set the Body to:
   ```json
   {
     "response": "{{$json.output}}"
   }
   ```
   *Note: Ensure you are mapping the text output of the AI Agent node.*

## Step 4: Link to the Frontend
1. Open your `skuprovision/.env.local` file.
2. Add the URL you copied from Step 1:
   ```env
   NEXT_PUBLIC_N8N_WEBHOOK_URL="https://your-n8n-instance.com/webhook/sku-chatbot"
   ```
3. Run `npm run build` and follow the deployment steps.

Now, whenever a user chats on the site, the message flows through n8n to your AI and back seamlessly!
