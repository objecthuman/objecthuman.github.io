+++
date = '2025-11-14T05:29:05Z'
draft = false
title = 'Your async file I/O code will always block in Python.'
+++

If I were to give you this piece of Python code and ask you if the `f.read()` part will block the event loop or not, what will be your answer?

```python
import asyncio

async def main():
    with open("a.txt", "r") as f:
        data = f.read()

asyncio.run(main())
```

**Short answer:** It's blocking.

**Long answer:**

Almost everyone thinks that file I/O by default is async in nature. We think that any type of I/O operation by default is non-blocking. Meaning that while the file is being read, we can jump to another task, and when the file is fully read, we will come back to it.

The `read()` function itself is a synchronous function. It does not support async file reading. It does not return any `future` which can be awaited.

How to make it, ahem, "async"?

```python
import asyncio

async def main():
    data = await asyncio.to_thread(read_file)
    print(data)

def read_file():
    with open("a.txt", "r") as f:
        return f.read()

asyncio.run(main())
```

But wait, that's not truly async. I am creating another thread and offloading the `read` task to another thread.

Well, the truth is file I/O in most runtimes is made async this way. Node.js uses the same trick. It just asks `libuv` to offload the file reading task to another thread.

[Aiofiles](https://github.com/Tinche/aiofiles), a Python library for making file I/O async, also does the same thing. It offloads the task to a threadpool.

The reason is that the `read()` syscall (used by `f.read()`) in \*nix systems is synchronous by design. It blocks the calling thread until data is available, whether from disk or cache.

Is there any other kernel API that enables us to make file reading truly async?

Yes, there is.

[io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html) is a kernel interface for async I/O. Then, why is it not used?

1. Runtimes targeting cross-platform compatibility need fallback implementation anyway as `io_uring` is only avialable for linux version `5.1+`. Meaning two code paths will need to be implemented.
2. Thread pool solution just works. It's simple, portable, and performs well for most use cases.
