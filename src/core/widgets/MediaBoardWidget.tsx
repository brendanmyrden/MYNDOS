import { useEffect, useId, useRef, useState } from "react";
import type { DragEvent } from "react";

import { getMediaKind, MAX_MEDIA_FILE_BYTES } from "./mediaBoardStorage";
import { useDeleteHotspot } from "./useDeleteHotspot";
import { useMediaBoard } from "./useMediaBoard";
import { useWidgetState } from "./useWidgetState";
import "./widgets.css";

type MediaBoardWidgetProps = {
  moduleName: string;
};

const formatPostDate = (timestamp: number) =>
  new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(timestamp);

export default function MediaBoardWidget({ moduleName }: MediaBoardWidgetProps) {
  const { state, updateWidget } = useWidgetState(moduleName);
  const { posts, isLoading, error, addPost, deletePost, clearError } = useMediaBoard(moduleName);
  const deleteHotspot = useDeleteHotspot<HTMLDivElement>();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [composerError, setComposerError] = useState("");

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }
    const nextUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [selectedFile]);

  if (!state.mediaBoard) return null;

  const resetComposer = () => {
    setSelectedFile(null);
    setCaption("");
    setComposerError("");
    setIsDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const closeComposer = () => {
    resetComposer();
    setIsComposerOpen(false);
  };

  const chooseFile = (file: File | undefined) => {
    clearError();
    setComposerError("");
    if (!file) return;
    if (!getMediaKind(file)) {
      setComposerError("Choose an image or video file.");
      return;
    }
    if (file.size > MAX_MEDIA_FILE_BYTES) {
      setComposerError("Choose a file smaller than 150 MB.");
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    chooseFile(event.dataTransfer.files[0]);
  };

  const handlePost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile || isPosting) return;
    setIsPosting(true);
    setComposerError("");
    try {
      await addPost(selectedFile, caption);
      closeComposer();
    } catch (postError) {
      setComposerError(postError instanceof Error ? postError.message : "Unable to post media.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Remove this post from the media board?")) return;
    try {
      await deletePost(postId);
    } catch {
      // The storage hook exposes the error in the widget.
    }
  };

  return (
    <section className="media-board widget-shell" {...deleteHotspot}>
      <span className="widget-hotspot" aria-hidden="true" />
      <div className="media-board__frame">
        <div className="media-board__header">
          <div className="media-board__header-left">
            <button
              type="button"
              className="widget-remove fluid-delete"
              onClick={() => updateWidget("mediaBoard", false)}
              aria-label="Remove media board"
            >
              x
            </button>
            <div>
              <div className="media-board__title">Media Board</div>
              <div className="media-board__subtitle">
                {moduleName.toUpperCase()} · {posts.length} {posts.length === 1 ? "post" : "posts"}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="module-btn media-board__add-button"
            onClick={() => {
              clearError();
              setIsComposerOpen((isOpen) => !isOpen);
            }}
          >
            {isComposerOpen ? "Close" : "+ Add media"}
          </button>
        </div>

        {isComposerOpen && (
          <form className="media-board__composer" onSubmit={handlePost}>
            <label
              htmlFor={fileInputId}
              className={`media-board__dropzone ${isDragging ? "is-dragging" : ""}`}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                id={fileInputId}
                className="media-board__file-input"
                type="file"
                accept="image/*,video/*"
                onChange={(event) => chooseFile(event.currentTarget.files?.[0])}
              />
              {selectedFile && previewUrl ? (
                <div className="media-board__draft-preview">
                  {getMediaKind(selectedFile) === "image" ? (
                    <img src={previewUrl} alt="Selected upload preview" />
                  ) : (
                    <video src={previewUrl} muted playsInline />
                  )}
                  <div className="media-board__draft-name">{selectedFile.name}</div>
                </div>
              ) : (
                <div className="media-board__dropzone-copy">
                  <span className="media-board__dropzone-icon">+</span>
                  <strong>Drop a photo or video here</strong>
                  <span>or click to browse · up to 150 MB</span>
                </div>
              )}
            </label>
            <div className="media-board__composer-fields">
              <label className="media-board__caption-label" htmlFor={`${fileInputId}-caption`}>
                Caption
              </label>
              <textarea
                id={`${fileInputId}-caption`}
                className="media-board__caption-input"
                value={caption}
                maxLength={180}
                rows={3}
                placeholder="Add context to this post…"
                onChange={(event) => setCaption(event.target.value)}
              />
              <div className="media-board__composer-footer">
                <span className="media-board__character-count">{caption.length}/180</span>
                <div className="media-board__composer-actions">
                  <button
                    type="button"
                    className="module-btn module-btn-ghost module-btn-sm"
                    onClick={closeComposer}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="module-btn module-btn-sm"
                    disabled={!selectedFile || isPosting}
                  >
                    {isPosting ? "Posting…" : "Post"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {(composerError || error) && (
          <div className="media-board__error" role="alert">
            {composerError || error}
          </div>
        )}

        {isLoading && posts.length === 0 ? (
          <div className="media-board__status" role="status">Loading board…</div>
        ) : posts.length === 0 ? (
          <button
            type="button"
            className="media-board__empty"
            onClick={() => setIsComposerOpen(true)}
          >
            <span className="media-board__empty-mark">+</span>
            <strong>Your board is ready</strong>
            <span>Post the first photo or video</span>
          </button>
        ) : (
          <div className="media-board__grid">
            {posts.map((post) => (
              <article className="media-board__post" key={post.id}>
                <div className="media-board__media">
                  {post.kind === "image" ? (
                    <img src={post.url} alt={post.caption || post.fileName} loading="lazy" />
                  ) : (
                    <video src={post.url} controls playsInline preload="metadata" />
                  )}
                  <span className="media-board__kind">{post.kind}</span>
                  <button
                    type="button"
                    className="media-board__post-remove"
                    onClick={() => void handleDeletePost(post.id)}
                    aria-label={`Remove ${post.fileName}`}
                  >
                    ×
                  </button>
                </div>
                <div className="media-board__post-copy">
                  {post.caption && <p>{post.caption}</p>}
                  <time dateTime={new Date(post.createdAt).toISOString()}>
                    {formatPostDate(post.createdAt)}
                  </time>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
