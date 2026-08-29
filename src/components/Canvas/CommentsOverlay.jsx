import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { MessageSquare, Check, Trash2, Send, X, CornerDownRight } from 'lucide-react';
export function CommentsOverlay({ zoom = 1 }) {
  const {
    project,
    activePageId,
    resolveComment,
    deleteComment,
    replyComment,
  } = useEditor();
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [replyInput, setReplyInput] = useState('');
  const comments = (project.comments || []).filter((c) => c.pageId === activePageId);
  const handleSendReply = (commentId) => {
    if (replyInput.trim()) {
      replyComment(commentId, replyInput.trim());
      setReplyInput('');
    }
  };
  return (
    <g id="comments-overlay">
      {comments.map((comm, idx) => {
        const isOpen = activeCommentId === comm.id;
        return (
          <g key={comm.id} transform={`translate(${comm.x}, ${comm.y})`}>
            <g
              onClick={(e) => {
                e.stopPropagation();
                setActiveCommentId(isOpen ? null : comm.id);
              }}
              className="cursor-pointer group"
            >
              <circle
                cx="0"
                cy="0"
                r={14 / zoom}
                fill={comm.resolved ? '#10B981' : '#F59E0B'}
                stroke="#FFFFFF"
                strokeWidth={2 / zoom}
                className="group-hover:scale-110 transition-transform shadow-lg"
              />
              <text
                x="0"
                y={4 / zoom}
                fill="#FFFFFF"
                fontSize={10 / zoom}
                fontFamily="Inter"
                fontWeight="700"
                textAnchor="middle"
                className="pointer-events-none select-none"
              >
                {idx + 1}
              </text>
            </g>
            {isOpen && (
              <foreignObject
                x={20 / zoom}
                y={-20 / zoom}
                width={280}
                height={260}
                className="overflow-visible"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-64 bg-neutral-900 border border-neutral-700/80 rounded-xl shadow-2xl p-3 text-xs text-neutral-200 select-auto animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2">
                    <div className="flex items-center gap-1.5 font-semibold text-neutral-100">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                        {comm.author[0]}
                      </div>
                      <span>{comm.author}</span>
                      <span className="text-[10px] text-neutral-500 font-normal">{comm.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => resolveComment(comm.id)}
                        className={`p-1 rounded hover:bg-neutral-800 transition-colors ${comm.resolved ? 'text-emerald-400' : 'text-neutral-400'}`}
                        title={comm.resolved ? 'Unresolve' : 'Resolve Comment'}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteComment(comm.id)}
                        className="p-1 text-neutral-400 hover:text-rose-400 rounded hover:bg-neutral-800 transition-colors"
                        title="Delete Comment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setActiveCommentId(null)}
                        className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-neutral-300 leading-relaxed mb-2.5 bg-neutral-800/40 p-2 rounded-md">
                    {comm.text}
                  </div>
                  {comm.replies && comm.replies.length > 0 && (
                    <div className="space-y-1.5 mb-2.5 max-h-28 overflow-y-auto pr-1">
                      {comm.replies.map((rep) => (
                        <div key={rep.id} className="p-1.5 bg-neutral-800/80 rounded flex items-start gap-1.5 text-[11px]">
                          <CornerDownRight className="w-3 h-3 text-neutral-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-neutral-200">{rep.author}: </span>
                            <span className="text-neutral-300">{rep.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 pt-1 border-t border-neutral-800">
                    <input
                      type="text"
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      placeholder="Reply..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendReply(comm.id);
                      }}
                      className="flex-1 bg-neutral-800 border border-neutral-700 rounded-md px-2 py-1 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => handleSendReply(comm.id)}
                      className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-colors"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </foreignObject>
            )}
          </g>
        );
      })}
    </g>
  );
}