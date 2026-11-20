import React from 'react';
import { Plus, Save, Trash2, Upload, Video } from 'lucide-react';
import { IMG_MAKKAH_HOTEL, IMG_PILGRIM_STORY, IMG_RAMADAN_HARAM } from '../data/defaultSiteData';
import { SiteCmsData, VideoTestimonial } from '../types';
import { parseVideoSource } from '../utils/videoUtils';

interface AdminVideoManagerProps {
  draft: SiteCmsData['videoSection'];
  onChange: (next: SiteCmsData['videoSection']) => void;
  onSave: () => Promise<void>;
  onToast: (msg: string) => void;
}

const THUMB_PRESETS = [
  { label: 'Makkah Clock Tower', url: IMG_MAKKAH_HOTEL },
  { label: 'Ramadan Haram Courtyard', url: IMG_RAMADAN_HARAM },
  { label: 'Pilgrim Family Portrait', url: IMG_PILGRIM_STORY },
];

export const AdminVideoManager: React.FC<AdminVideoManagerProps> = ({
  draft,
  onChange,
  onSave,
  onToast,
}) => {
  const handleAddVideo = () => {
    const newVid: VideoTestimonial = {
      id: `vid-${Date.now()}`,
      pilgrimName: 'New Pilgrim Review',
      city: 'London, UK',
      packageLabel: '5 Star Umrah Package',
      duration: '02:00',
      thumbnailUrl: IMG_MAKKAH_HOTEL,
      videoUrl: '',
      quoteSummary: 'Share a short highlight quote from this pilgrim...',
      fullTranscript: 'Full review transcript or notes from the testimonial video...',
    };
    onChange({ ...draft, videos: [newVid, ...draft.videos] });
  };

  const updateVideoField = (
    idx: number,
    patch: Partial<VideoTestimonial>
  ) => {
    const nextList = [...draft.videos];
    nextList[idx] = { ...nextList[idx], ...patch };
    onChange({ ...draft, videos: nextList });
  };

  const handleVideoUrlChange = (idx: number, url: string) => {
    const current = draft.videos[idx];
    const parsed = parseVideoSource(url);
    const patch: Partial<VideoTestimonial> = { videoUrl: url };

    // Auto-fill YouTube thumbnail if current thumbnail is blank or a local default preset
    const isDefaultThumb =
      !current.thumbnailUrl ||
      current.thumbnailUrl.startsWith('/src/assets/') ||
      current.thumbnailUrl.includes('img.youtube.com');
    if (parsed.suggestedThumbnail && isDefaultThumb) {
      patch.thumbnailUrl = parsed.suggestedThumbnail;
    }

    updateVideoField(idx, patch);
  };

  const handleVideoFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 600 * 1024) {
      onToast(
        'Video file exceeds 600KB database limit. For HD/longer videos, paste a YouTube, Vimeo, or MP4 URL instead.'
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateVideoField(idx, { videoUrl: reader.result });
        onToast('Video clip loaded — click Publish to save live!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleThumbUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 250 * 1024) {
      onToast('Please choose a thumbnail image under 250KB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateVideoField(idx, { thumbnailUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div>
          <h3 className="font-semibold text-slate-900">
            Customer Video Testimonials Manager ({draft.videos.length} Videos)
          </h3>
          <p className="text-xs text-slate-500">
            Add YouTube links, Shorts, Vimeo URLs, direct MP4 links, or upload short MP4/WebM clips with custom thumbnails &amp; transcripts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddVideo}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-stone-300 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Video</span>
          </button>
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0B3B2E] text-white text-xs font-semibold hover:bg-[#082A21] cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Publish Video Testimonials</span>
          </button>
        </div>
      </div>

      {/* Section Title & Kicker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAFAF8] border border-stone-200 rounded-xl p-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Section Kicker
          </label>
          <input
            type="text"
            value={draft.kicker}
            onChange={(e) => onChange({ ...draft, kicker: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Section Heading
          </label>
          <input
            type="text"
            value={draft.title}
            onChange={(e) => onChange({ ...draft, title: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
          />
        </div>
      </div>

      {/* Video Cards List */}
      <div className="space-y-5">
        {draft.videos.map((vid, idx) => {
          const parsed = parseVideoSource(vid.videoUrl);
          const sourceLabel =
            parsed.kind === 'youtube'
              ? 'YouTube Embed Ready'
              : parsed.kind === 'vimeo'
              ? 'Vimeo Embed Ready'
              : parsed.kind === 'gdrive'
              ? 'Google Drive Video'
              : parsed.kind === 'direct'
              ? vid.videoUrl?.startsWith('data:video/')
                ? 'Uploaded Video Clip'
                : 'Direct Video URL'
              : 'Transcript Only (No Video URL Yet)';

          return (
            <div
              key={vid.id}
              className="border border-stone-200 rounded-xl p-5 bg-[#FAFAF8] space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <Video className="w-4 h-4 text-[#0B3B2E]" />
                  <span className="font-semibold text-sm text-slate-900">
                    {idx + 1}. {vid.pilgrimName || 'Untitled Video'}
                  </span>
                  <span className="text-xs font-medium text-[#9A7414]">
                    · {sourceLabel}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...draft,
                      videos: draft.videos.filter((_, i) => i !== idx),
                    })
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Thumbnail + Preview */}
                <div className="lg:col-span-4 space-y-3">
                  <div className="aspect-video rounded-lg overflow-hidden bg-slate-900 border border-stone-200 relative">
                    <img
                      src={vid.thumbnailUrl || IMG_MAKKAH_HOTEL}
                      alt={vid.pilgrimName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Thumbnail Image URL
                    </label>
                    <input
                      type="text"
                      value={vid.thumbnailUrl}
                      onChange={(e) =>
                        updateVideoField(idx, { thumbnailUrl: e.target.value })
                      }
                      placeholder="https://... (auto-filled for YouTube)"
                      className="w-full px-2.5 py-1.5 rounded border border-stone-300 text-xs bg-white"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value=""
                      onChange={(e) =>
                        e.target.value &&
                        updateVideoField(idx, { thumbnailUrl: e.target.value })
                      }
                      className="flex-1 px-2 py-1.5 rounded border border-stone-300 text-[11px] bg-white"
                    >
                      <option value="">Choose Preset Cover...</option>
                      {THUMB_PRESETS.map((p) => (
                        <option key={p.url} value={p.url}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <label className="px-2.5 py-1.5 rounded border border-stone-300 bg-white text-[11px] font-medium text-slate-700 hover:bg-stone-50 cursor-pointer inline-flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Upload Cover</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleThumbUpload(e, idx)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Video URL / Upload + Metadata Fields */}
                <div className="lg:col-span-8 space-y-3">
                  <div className="bg-white border border-stone-200 rounded-lg p-3.5 space-y-2.5">
                    <label className="block text-xs font-semibold text-[#0B3B2E]">
                      Video Source (YouTube, Shorts, Vimeo, MP4 URL or Upload Clip)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={
                          vid.videoUrl?.startsWith('data:video/')
                            ? '[Uploaded Local Video Clip]'
                            : vid.videoUrl || ''
                        }
                        onChange={(e) => handleVideoUrlChange(idx, e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/... or MP4 URL"
                        className="flex-1 px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white"
                      />
                      <label className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-stone-300 bg-[#FAFAF8] hover:bg-stone-100 text-xs font-semibold text-slate-700 cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5 text-[#0B3B2E]" />
                        <span>Upload Video (&le;600KB)</span>
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime"
                          onChange={(e) => handleVideoFileUpload(e, idx)}
                          className="hidden"
                        />
                      </label>
                      {vid.videoUrl && (
                        <button
                          type="button"
                          onClick={() => updateVideoField(idx, { videoUrl: '' })}
                          className="px-2.5 py-2 rounded-lg border border-stone-200 text-xs text-red-600 hover:bg-red-50 cursor-pointer shrink-0"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        Pilgrim Name
                      </label>
                      <input
                        type="text"
                        value={vid.pilgrimName}
                        onChange={(e) =>
                          updateVideoField(idx, { pilgrimName: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 rounded border border-stone-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        UK City
                      </label>
                      <input
                        type="text"
                        value={vid.city}
                        onChange={(e) =>
                          updateVideoField(idx, { city: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 rounded border border-stone-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        Package Label
                      </label>
                      <input
                        type="text"
                        value={vid.packageLabel}
                        onChange={(e) =>
                          updateVideoField(idx, { packageLabel: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 rounded border border-stone-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={vid.duration}
                        onChange={(e) =>
                          updateVideoField(idx, { duration: e.target.value })
                        }
                        placeholder="02:18"
                        className="w-full px-2.5 py-1.5 rounded border border-stone-300 text-xs font-mono bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Quote Summary
                    </label>
                    <input
                      type="text"
                      value={vid.quoteSummary}
                      onChange={(e) =>
                        updateVideoField(idx, { quoteSummary: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 rounded border border-stone-300 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Full Transcript / Description
                    </label>
                    <textarea
                      rows={2}
                      value={vid.fullTranscript}
                      onChange={(e) =>
                        updateVideoField(idx, { fullTranscript: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 rounded border border-stone-300 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
