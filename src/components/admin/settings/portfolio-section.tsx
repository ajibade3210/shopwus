import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  ImagePlus,
  Images,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ConfirmModal } from "@/components/shared";
import { MAX_PORTFOLIO_PROJECTS } from "@/constants";
import type { PortfolioSectionProps } from "@/types";
import { Card } from "./card";
import { CategoryDropdown } from "./category-dropdown";
import { Toggle } from "./toggle";

export function PortfolioSection({
  portfolio,
  categories = [],
  addPortfolioCategory,
  removePortfolioCategory,
  showPortfolio,
  setShowPortfolio,
  showAddProjectModal,
  setShowAddProjectModal,
  showManageGalleryModal,
  setShowManageGalleryModal,
  newProject,
  setNewProject,
  isUploadingProjectImage,
  isUploadingGalleryImages = false,
  handleProjectImageUpload,
  handleGalleryImagesUpload,
  removeGalleryImageFromNewProject,
  handleAddProject,
  removeProject,
  moveProject,
  draggedProjectIndex,
  dragOverProjectIndex,
  handleDragStart,
  handleDragEnter,
  handleDragEnd,
  onToast,
}: PortfolioSectionProps) {
  const galleryPhotos = newProject.gallery || [];
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const pendingProject = portfolio.find(p => p.id === pendingRemoveId);

  const handleConfirmRemove = async () => {
    if (!pendingRemoveId) return;
    setIsRemoving(true);
    try {
      await removeProject(pendingRemoveId);
    } finally {
      setIsRemoving(false);
      setPendingRemoveId(null);
    }
  };

  return (
    <>
      <Card
        title="Projects"
        description="High-resolution visuals that highlight your aesthetic standard, case studies, and client transformations."
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6b7280]">Show on page</span>
            <Toggle
              on={showPortfolio}
              onClick={() => setShowPortfolio(!showPortfolio)}
              ariaLabel="Toggle portfolio section visibility"
            />
          </div>
        }
      >
        <div className="space-y-6">
          {!showPortfolio && (
            <div className="bg-[#fef3c7] text-[#92400e] text-xs px-3 py-2 rounded-lg border border-[#fde68a]">
              This section is currently hidden on your public studio page.
            </div>
          )}
          {portfolio.length >= MAX_PORTFOLIO_PROJECTS && (
            <div className="bg-[#eff6ff] text-[#1e40af] text-xs px-3.5 py-2.5 rounded-xl border border-[#bfdbfe] flex items-center justify-between gap-2">
              <span>
                Maximum portfolio capacity reached ({portfolio.length}/{MAX_PORTFOLIO_PROJECTS}{" "}
                projects).
              </span>
              <span className="font-semibold text-[11px] uppercase tracking-wider text-[#1d4ed8]">
                Unlimited Tier Cap
              </span>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3.5">
            <button
              type="button"
              onClick={() => {
                if (portfolio.length >= MAX_PORTFOLIO_PROJECTS) {
                  onToast(`Maximum limit of ${MAX_PORTFOLIO_PROJECTS} portfolio projects reached`);
                  return;
                }
                setShowAddProjectModal(true);
              }}
              className="dark-button text-xs py-2.5 px-4 rounded-xl flex-1 justify-center"
            >
              <Upload size={15} /> Upload new project
            </button>
            <button
              type="button"
              onClick={() => setShowManageGalleryModal(true)}
              className="outline-button text-xs py-2.5 px-4 rounded-xl flex-1 justify-center"
            >
              <ImagePlus size={15} /> Manage gallery ({portfolio.length}/{MAX_PORTFOLIO_PROJECTS})
            </button>
          </div>

          {/* Current Projects List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {portfolio.map(proj => {
              const photoCount = proj.gallery && proj.gallery.length > 0 ? proj.gallery.length : 1;
              return (
                <div
                  key={proj.id}
                  className="border border-[#e5e7eb] rounded-xl p-3.5 bg-white flex items-center justify-between gap-3 shadow-2xs hover:border-[#d1d5db] transition-all"
                >
                  <div className="flex items-center gap-3 overflow-hidden min-w-0">
                    <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-[#e5e7eb]">
                      <Image
                        src={proj.image}
                        alt={proj.title}
                        fill
                        unoptimized
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                    <div className="truncate min-w-0">
                      <strong className="text-xs font-bold block text-[#111827] truncate">
                        {proj.title}
                      </strong>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-[#6b7280] font-medium truncate">
                          {proj.category}
                        </span>
                        {photoCount > 1 && (
                          <span className="text-[9px] bg-[#f3f4f6] text-[#4b5563] px-1.5 py-0.5 rounded font-mono shrink-0">
                            {photoCount} photos
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPendingRemoveId(proj.id)}
                    className="text-[#9ca3af] hover:text-[#dc2626] p-1.5 rounded transition-colors cursor-pointer shrink-0"
                    title="Remove project"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 bg-[#191c1d]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e7eb] rounded-xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowAddProjectModal(false)}
              className="absolute right-4 top-4 text-[#6b7280] hover:text-[#191c1d] p-1"
            >
              <X size={18} />
            </button>
            <h3 className="font-sans text-xl text-[#191c1d] font-bold mb-1">
              Add New Showcase Project
            </h3>
            <p className="text-xs text-[#6b7280] mb-5">
              Upload multiple images to showcase rich case studies in your public atelier gallery.
            </p>

            <form onSubmit={handleAddProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#1f2937] font-medium mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aethel Luxury Rebrand"
                  value={newProject.title || ""}
                  onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full bg-white border border-[#e5e7eb] rounded-lg px-3.5 py-2.5 text-xs text-[#191c1d] focus:outline-none h-[38px] transition-colors hover:border-[#d1d5db]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                <CategoryDropdown
                  value={newProject.category}
                  onChange={cat => setNewProject(prev => ({ ...prev, category: cat }))}
                  categories={categories}
                  onAddCategory={addPortfolioCategory}
                  onRemoveCategory={removePortfolioCategory}
                  label="Category"
                  size="md"
                />
                <div>
                  <label className="block text-[#1f2937] font-medium text-xs mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. London & Lagos"
                    value={newProject.location || ""}
                    onChange={e => setNewProject({ ...newProject, location: e.target.value })}
                    className="w-full bg-white border border-[#e5e7eb] rounded-lg px-3.5 py-2.5 text-xs text-[#191c1d] focus:outline-none h-[38px] transition-colors hover:border-[#d1d5db]"
                  />
                </div>
              </div>

              {/* Cover Photo */}
              <div>
                <label className="block text-[#1f2937] font-medium mb-1.5">
                  Project Cover Photo *
                </label>
                {newProject.image ? (
                  <div className="space-y-2">
                    <div className="relative rounded-lg overflow-hidden border border-[#e5e7eb] bg-[#f3f4f5] group aspect-[16/9] max-h-44 w-full flex items-center justify-center">
                      <Image
                        src={newProject.image}
                        alt="Project Cover Preview"
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label className="cursor-pointer bg-white text-[#191c1d] hover:bg-[#f3f4f5] px-3 py-1.5 rounded text-xs font-medium inline-flex items-center gap-1.5 shadow-sm transition-colors">
                          {isUploadingProjectImage ? (
                            <>
                              <Loader2 size={12} className="animate-spin" /> Uploading...
                            </>
                          ) : (
                            <>
                              <Upload size={12} /> Change Photo
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={isUploadingProjectImage}
                            onChange={handleProjectImageUpload}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setNewProject({ ...newProject, image: "" })}
                          className="bg-[#ba1a1a] text-white hover:bg-[#93000a] px-3 py-1.5 rounded text-xs font-medium inline-flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer block border-2 border-dashed border-[#e5e7eb] hover:border-[#0058be] bg-[#f8f9fa] hover:bg-[#f0f6ff]/30 rounded-lg p-5 text-center transition-all group">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isUploadingProjectImage}
                      onChange={handleProjectImageUpload}
                    />
                    <div className="w-9 h-9 rounded-full bg-white border border-[#e5e7eb] group-hover:border-[#0058be] text-[#0058be] flex items-center justify-center mx-auto mb-1.5 shadow-2xs group-hover:scale-105 transition-all">
                      {isUploadingProjectImage ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Upload size={16} />
                      )}
                    </div>
                    <span className="block text-xs font-semibold text-[#191c1d] group-hover:text-[#0058be] transition-colors">
                      {isUploadingProjectImage
                        ? "Uploading to CDN..."
                        : "Click to upload project cover image"}
                    </span>
                    <span className="block text-[10px] text-[#6b7280] mt-0.5">
                      PNG, JPG, or WebP · Main banner image
                    </span>
                  </label>
                )}
              </div>

              {/* Multiple Gallery Photos */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[#1f2937] font-medium">
                    Additional Gallery Photos ({galleryPhotos.length})
                  </label>
                  {handleGalleryImagesUpload && (
                    <label className="cursor-pointer text-[#0058be] hover:underline inline-flex items-center gap-1 text-[11px] font-medium">
                      {isUploadingGalleryImages ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Plus size={12} />
                      )}
                      <span>Add More Photos</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        disabled={isUploadingGalleryImages}
                        onChange={handleGalleryImagesUpload}
                      />
                    </label>
                  )}
                </div>

                {galleryPhotos.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 bg-[#f8f9fa] p-2.5 rounded-lg border border-[#e5e7eb] max-h-36 overflow-y-auto">
                    {galleryPhotos.map((imgUrl, i) => (
                      <div
                        key={`${imgUrl}-${i}`}
                        className="relative aspect-square rounded-md overflow-hidden border border-[#e5e7eb] bg-white group"
                      >
                        <Image
                          src={imgUrl}
                          alt={`Gallery photo ${i + 1}`}
                          fill
                          unoptimized
                          sizes="80px"
                          className="object-cover"
                        />
                        {removeGalleryImageFromNewProject && (
                          <button
                            type="button"
                            onClick={() => removeGalleryImageFromNewProject(i)}
                            className="absolute top-1 right-1 bg-black/70 hover:bg-[#ba1a1a] text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Remove photo"
                          >
                            <Trash2 size={10} />
                          </button>
                        )}
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] text-center font-mono py-0.5">
                          #{i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : handleGalleryImagesUpload ? (
                  <label className="border border-dashed border-[#e5e7eb] hover:border-[#0058be] bg-[#f8f9fa] hover:bg-[#f0f6ff]/30 rounded-lg p-3.5 text-center text-[#6b7280] text-[11px] flex items-center justify-center gap-2 cursor-pointer transition-colors group">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      disabled={isUploadingGalleryImages}
                      onChange={handleGalleryImagesUpload}
                    />
                    {isUploadingGalleryImages ? (
                      <Loader2 size={14} className="animate-spin text-[#0058be]" />
                    ) : (
                      <Images
                        size={14}
                        className="text-[#9ca3af] group-hover:text-[#0058be] transition-colors"
                      />
                    )}
                    <span className="group-hover:text-[#0058be] font-medium transition-colors">
                      {isUploadingGalleryImages
                        ? "Uploading images..."
                        : "Click to select and upload multiple gallery images"}
                    </span>
                  </label>
                ) : (
                  <div className="border border-dashed border-[#e5e7eb] rounded-lg p-3 text-center text-[#6b7280] text-[11px] flex items-center justify-center gap-1.5">
                    <Images size={14} className="text-[#9ca3af]" />
                    <span>Optional: Add multiple images to build a full project gallery</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#1f2937] font-medium mb-1">
                  Project Narrative / Scope
                </label>
                <textarea
                  rows={3}
                  placeholder="A brief editorial summary of this project and design deliverables..."
                  value={newProject.description || ""}
                  onChange={e =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  className="w-full bg-white border border-[#e5e7eb] rounded p-3 text-xs text-[#191c1d] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="outline-button flex-1 py-2.5 text-xs font-medium justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingProjectImage || isUploadingGalleryImages}
                  className="dark-button flex-1 py-2.5 text-xs font-medium justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploadingProjectImage || isUploadingGalleryImages ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Uploading Image...
                    </>
                  ) : (
                    <>
                      <Plus size={14} /> Add Project
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Gallery Arrangement Modal */}
      {showManageGalleryModal && (
        <div className="fixed inset-0 z-50 bg-[#191c1d]/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white border border-[#e5e7eb] rounded-lg max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between pb-4 border-b border-[#e5e7eb]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#0058be] font-semibold">
                  Gallery Showcase · {portfolio.length} Projects
                </span>
                <h3 className="font-sans text-2xl text-[#191c1d] font-bold mt-0.5">
                  Manage Gallery Arrangement
                </h3>
                <p className="text-xs text-[#6b7280] mt-1">
                  Drag items or use the arrows to reorder how projects appear in your public
                  portfolio.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowManageGalleryModal(false)}
                className="text-[#6b7280] hover:text-[#191c1d] p-1.5 rounded-md hover:bg-[#f3f4f5] cursor-pointer transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-2.5 pr-1">
              {portfolio.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-[#e5e7eb] rounded-lg">
                  <ImagePlus size={32} className="mx-auto text-[#9ca3af] mb-2" />
                  <p className="text-sm font-medium text-[#191c1d]">No gallery projects yet</p>
                  <p className="text-xs text-[#6b7280] mt-1">
                    Upload your first showcase project to get started.
                  </p>
                </div>
              ) : (
                portfolio.map((proj, idx) => {
                  const isDragging = draggedProjectIndex === idx;
                  const isDragOver = dragOverProjectIndex === idx && draggedProjectIndex !== idx;
                  const photoCount =
                    proj.gallery && proj.gallery.length > 0 ? proj.gallery.length : 1;

                  return (
                    <div
                      key={proj.id}
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragEnter={() => handleDragEnter(idx)}
                      onDragEnd={handleDragEnd}
                      onDragOver={e => e.preventDefault()}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        isDragging
                          ? "opacity-40 bg-[#f3f4f5] border-dashed border-[#0058be]"
                          : isDragOver
                            ? "border-[#0058be] bg-[#f0f6ff]/40 shadow-sm"
                            : "border-[#e5e7eb] bg-white hover:border-[#cbd5e1] hover:shadow-2xs"
                      }`}
                    >
                      <div className="cursor-grab active:cursor-grabbing text-[#9ca3af] hover:text-[#191c1d] p-1">
                        <GripVertical size={16} />
                      </div>
                      <div className="w-6 text-center text-xs font-mono font-semibold text-[#6b7280]">
                        #{idx + 1}
                      </div>
                      <div className="relative w-14 h-14 rounded-md overflow-hidden bg-[#f3f4f5] border border-[#e5e7eb] shrink-0">
                        <Image
                          src={proj.image}
                          alt={proj.title}
                          fill
                          unoptimized
                          sizes="56px"
                          className="object-cover"
                        />
                        {idx === 0 && (
                          <span className="absolute bottom-0 inset-x-0 bg-[#0058be] text-white text-[8px] font-bold uppercase tracking-wider text-center py-0.5">
                            Cover
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#191c1d] truncate">{proj.title}</h4>
                        <p className="text-[11px] text-[#6b7280] truncate">
                          {proj.category} · {proj.location}{" "}
                          {photoCount > 1 && `(${photoCount} photos)`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveProject(idx, "up")}
                          disabled={idx === 0}
                          className="p-1.5 rounded hover:bg-[#f3f4f5] text-[#6b7280] hover:text-[#191c1d] disabled:opacity-30 disabled:pointer-events-none"
                          title="Move up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveProject(idx, "down")}
                          disabled={idx === portfolio.length - 1}
                          className="p-1.5 rounded hover:bg-[#f3f4f5] text-[#6b7280] hover:text-[#191c1d] disabled:opacity-30 disabled:pointer-events-none"
                          title="Move down"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingRemoveId(proj.id)}
                          className="p-1.5 rounded hover:bg-[#fee2e2] text-[#9ca3af] hover:text-[#dc2626]"
                          title="Delete from gallery"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-4 border-t border-[#e5e7eb] flex items-center justify-between">
              <span className="text-xs text-[#6b7280]">
                Changes apply immediately to your live studio.
              </span>
              <button
                type="button"
                onClick={() => setShowManageGalleryModal(false)}
                className="dark-button text-xs py-2 px-4"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={Boolean(pendingRemoveId)}
        onClose={() => !isRemoving && setPendingRemoveId(null)}
        onConfirm={handleConfirmRemove}
        title="Remove project?"
        description={`"${pendingProject?.title}" will be permanently removed from your portfolio.`}
        confirmLabel="Remove Project"
        isLoading={isRemoving}
      />
    </>
  );
}
