import React from 'react';
import {
  CheckCircle2,
  MailCheck,
  ShieldCheck,
  Star,
  Video,
  X,
} from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { InfoArticle, VideoTestimonial } from '../types';
import { QuoteSubmissionResult } from '../context/FirebaseContext';

export type InfoModalState =
  | { type: 'none' }
  | { type: 'article'; article: InfoArticle }
  | { type: 'atol' }
  | { type: 'stories' }
  | { type: 'video'; video: VideoTestimonial }
  | { type: 'quoteEmail'; result: QuoteSubmissionResult; recipientEmail: string };

interface InfoModalProps {
  state: InfoModalState;
  onClose: () => void;
  onScrollToQuote: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  state,
  onClose,
  onScrollToQuote,
}) => {
  const { siteContent } = useFirebase();

  if (state.type === 'none') return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Top Bar */}
        <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between gap-4">
          <span className="text-xs font-semibold tracking-wide text-[#9A7414] uppercase">
            {state.type === 'atol' && 'CAA Financial Protection Verification'}
            {state.type === 'article' && state.article.category}
            {state.type === 'stories' && 'Verified UK Pilgrim Reviews'}
            {state.type === 'video' && 'Customer Video Testimonial'}
            {state.type === 'quoteEmail' && 'Email Confirmation Dispatched'}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Modal"
            className="p-2 rounded-lg border border-stone-200 text-slate-600 hover:bg-stone-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8">
          {/* ATOL Verification Modal */}
          {state.type === 'atol' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-10 h-10 text-[#0B3B2E]" />
                <div>
                  <h3 className="font-display text-2xl font-semibold text-slate-900">
                    {siteContent.contact.atolNumber} Verified Protection
                  </h3>
                  <p className="text-xs text-slate-500">
                    Civil Aviation Authority (UK) Air Travel Organiser&rsquo;s Licence
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                All flight-inclusive Hajj &amp; Umrah packages booked with{' '}
                <strong>{siteContent.contact.brandName}</strong> are financially protected
                by the ATOL scheme. Upon payment of your deposit, you automatically
                receive an official ATOL Certificate listing your flights, hotels, and
                protected party members.
              </p>
              <div className="bg-[#FAFAF8] border border-stone-200 rounded-xl p-4 text-xs space-y-1.5 font-mono-num text-slate-700">
                <p>Licence Holder: {siteContent.contact.brandName} Ltd (United Kingdom)</p>
                <p>Licence Number: {siteContent.contact.atolNumber}</p>
                <p>Status: Active &amp; In Good Standing</p>
              </div>
            </div>
          )}

          {/* Guide / Service / About Article Modal */}
          {state.type === 'article' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-display text-3xl font-semibold text-slate-900 mb-1">
                  {state.article.title}
                </h3>
                <p className="text-sm font-medium text-[#0B3B2E]">
                  {state.article.subtitle}
                </p>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {state.article.summary}
              </p>
              <ul className="space-y-2 bg-[#FAFAF8] border border-stone-200 rounded-xl p-5">
                {state.article.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#0B3B2E] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              {state.article.bodyParagraphs.map((p, i) => (
                <p key={i} className="text-sm text-slate-600 leading-relaxed">
                  {p}
                </p>
              ))}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onScrollToQuote();
                  }}
                  className="px-5 py-2.5 rounded-lg bg-[#0B3B2E] text-white text-sm font-semibold hover:bg-[#082A21] cursor-pointer"
                >
                  Request Bespoke Quote
                </button>
              </div>
            </div>
          )}

          {/* Pilgrim Stories List */}
          {state.type === 'stories' && (
            <div className="space-y-4">
              <h3 className="font-display text-3xl font-semibold text-slate-900">
                Verified Pilgrim Stories
              </h3>
              {siteContent.storiesSection.stories.map((st) => (
                <div
                  key={st.id}
                  className="bg-[#FAFAF8] border border-stone-200 rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-slate-900 text-sm">
                      {st.name} · {st.city}
                    </p>
                    <div className="flex items-center gap-0.5 text-[#C59B27]">
                      {Array.from({ length: st.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs font-medium text-[#0B3B2E] mb-2">
                    {st.packageTaken}
                  </p>
                  <p className="text-sm text-slate-600 italic leading-relaxed">
                    "{st.quote}"
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Video Testimonial Player */}
          {state.type === 'video' && (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950">
                <img
                  src={state.video.thumbnailUrl}
                  alt={state.video.pilgrimName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-55"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-black/35">
                  <Video className="w-12 h-12 text-[#E5C158] mb-3" />
                  <p className="font-display text-2xl font-semibold mb-1">
                    {state.video.pilgrimName} ({state.video.city})
                  </p>
                  <p className="text-xs text-stone-200 mb-3">
                    {state.video.packageLabel} · Duration {state.video.duration}
                  </p>
                </div>
              </div>
              <div className="bg-[#FAFAF8] border border-stone-200 rounded-xl p-5">
                <p className="text-xs font-semibold text-[#0B3B2E] mb-2">
                  Pilgrim Video Transcript
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  "{state.video.fullTranscript}"
                </p>
              </div>
            </div>
          )}

          {/* Quote Submission Email Confirmation Preview */}
          {state.type === 'quoteEmail' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MailCheck className="w-9 h-9 text-[#0B3B2E]" />
                <div>
                  <h3 className="font-display text-2xl font-semibold text-slate-900">
                    Quote Request Received &amp; Email Prepared
                  </h3>
                  <p className="text-xs text-slate-500">
                    Saved in database · Admin notified immediately · Copy dispatched to{' '}
                    <strong>{state.recipientEmail}</strong>
                  </p>
                </div>
              </div>

              <div className="bg-[#FAFAF8] border border-stone-200 rounded-xl p-5 space-y-3">
                <div className="border-b border-stone-200 pb-2 text-xs text-slate-600">
                  <p>
                    <strong>To:</strong> {state.recipientEmail}
                  </p>
                  <p>
                    <strong>Subject:</strong> {state.result.emailSubject}
                  </p>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-xs md:text-sm text-slate-700 leading-relaxed">
                  {state.result.emailBody}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
