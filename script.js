if (recognizeBtn) {
    recognizeBtn.addEventListener("click", async () => {
      if (!selectedFiles.length) {
        setStatus("Vui lòng chọn ít nhất 1 ảnh trước.", true);
        return;
      }

      const customLangInput = document.getElementById("customLangInput");
      const lang = (customLangInput?.value || "vie").trim() || "vie";

      try {
        recognizeBtn.disabled = true;
        if (progressWrapper) progressWrapper.classList.remove("hidden");
        if (progressBar) progressBar.style.width = "5%";
        if (progressText) progressText.textContent = "Đang khởi tạo... 5%";

        const worker = await Tesseract.createWorker(lang, 1, {
          logger: (m) => {
            if (
              m.status === "recognizing text" &&
              typeof m.progress === "number"
            ) {
              const pct = Math.round(m.progress * 100);
              if (progressBar) progressBar.style.width = `${pct}%`;
              if (progressText) {
                progressText.textContent = `Đang nhận dạng... ${pct}%`;
              }
            }
          },
        });

        const { data } = await worker.recognize(selectedFiles[0]);
        await worker.terminate();

        const finalText = applyProcessedResult(data?.text || "");
        if (resultText) {
          resultText.value = f