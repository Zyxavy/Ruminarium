from llama_cpp import Llama
import time

start_time = time.time()

# Initialize the model
llm = Llama(
    model_path="tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf",
    n_ctx=2048,  # Context window
    n_threads=4,
    verbose=True
)

load_time = time.time() - start_time
print(f"Model loaded in {load_time:.2f} seconds.")

print("\nThinking...")
prompt = "Q: What is a good journaling prompt for someone feeling stressed? A:"

start_gen = time.time()

output = llm(
    prompt,
    max_tokens=150,
    temperature=0.8,
    stop=["Q:"],
    echo=True
)

gen_time = time.time() - start_gen

print(f"\nFull output:")
print(output['choices'][0]['text'])
print(f"\nGeneration took {gen_time:.2f} seconds.")
print(f"Finish reason: {output['choices'][0]['finish_reason']}")