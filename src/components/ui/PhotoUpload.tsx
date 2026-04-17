import { useRef, useState, type DragEvent } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "../layout/Icon";
import { cn } from "../../lib/utils";

interface Props {
  maxFiles?: number;
  className?: string;
}

export function PhotoUpload({ maxFiles = 5, className }: Props) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  const isFull = files.length >= maxFiles;

  const addFiles = (incoming: FileList | null) => {
    if (!incoming || isFull) return;
    const images = Array.from(incoming).filter((f) => f.type.startsWith("image/"));
    const allowed = images.slice(0, maxFiles - files.length);
    if (!allowed.length) return;
    const newPreviews = allowed.map((f) => URL.createObjectURL(f));
    setFiles((prev) => [...prev, ...allowed]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    // Reset input so same file can be re-added after removal
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <div className={className}>
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={isFull ? -1 : 0}
        aria-disabled={isFull}
        onClick={() => !isFull && inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && !isFull && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!isFull) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-[14px] border-2 border-dashed px-6 py-8 text-center transition-colors",
          !isFull && "cursor-pointer",
          dragging
            ? "border-brand-500 bg-brand-50"
            : isFull
              ? "border-[color:var(--color-border)] bg-[#fafbfc] opacity-60 cursor-not-allowed"
              : "border-[color:var(--color-border)] bg-[#fafbfc] hover:border-brand-400 hover:bg-brand-50/50",
        )}
      >
        <span className={cn(
          "h-11 w-11 rounded-full flex items-center justify-center transition-colors",
          dragging ? "bg-brand-500 text-white" : "bg-brand-100 text-brand-500",
        )}>
          <Icon name="upload" size={20} />
        </span>

        <div>
          <p className="text-[13.5px] font-medium text-ink">
            {isFull ? t("incident.photos.maxReached") : t("incident.photos.hint")}
          </p>
          <p className="text-[12px] text-muted mt-0.5">
            {t("incident.photos.hintSub", { max: maxFiles })}
          </p>
        </div>

        {!isFull && (
          <span className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-[color:var(--color-border)] bg-white text-[12.5px] font-medium text-ink-soft shadow-sm">
            <Icon name="file" size={13} />
            Parcourir
          </span>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {/* Thumbnail grid */}
      {previews.length > 0 && (
        <div className="mt-3">
          <p className="text-[12px] text-muted mb-2">
            {t("incident.photos.count", { count: files.length })}
          </p>
          <div className="flex flex-wrap gap-2">
            {previews.map((src, i) => (
              <div
                key={src}
                className="relative group w-[88px] h-[88px] rounded-[10px] overflow-hidden border border-[color:var(--color-border)] bg-[#f6f7fb] shrink-0"
              >
                <img src={src} alt={files[i]?.name ?? ""} className="w-full h-full object-cover" />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  title={t("incident.photos.remove") as string}
                  className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger-500"
                >
                  <Icon name="close" size={12} />
                </button>
                {/* File name tooltip */}
                <p className="absolute bottom-0 inset-x-0 px-1.5 py-1 text-[10px] text-white bg-black/50 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                  {files[i]?.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
