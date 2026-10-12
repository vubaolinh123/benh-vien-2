"use client";
import { SiteLink } from "@/components/ui/site-link";

import { useState } from "react";
import { usePublicSite } from "@/features/dialog/dialog-provider";
import { Icon } from "@/components/ui/icon";

export function Questions() {
  const data = usePublicSite();
  const copy = data.homepage?.copy || {};
  const questions = data.posts.filter((item) => item.category === "qa");
  const [page, setPage] = useState(0);
  if (!questions.length) return <p className="section-note">{copy.qaEmpty}</p>;
  return (
    <>
      <div className="qa-grid" id="qa-grid" aria-live="polite">
        {questions.slice(page * 2, page * 2 + 2).map((item) => (
          <article className="question-card" key={item._id}>
            <div className="question-person">
              <span>
                <Icon name="users" />
              </span>
              <div>
                <strong>{copy.qaCustomer}</strong>
                <small>{copy.qaCaption}</small>
              </div>
            </div>
            <div className="question-bubble">
              <small>{copy.qaCategory}</small>
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
              <SiteLink className="button" href={`/hoi-dap/${item.slug}/`}>
                <Icon name="message" /> {copy.qaAnswer}
              </SiteLink>
            </div>
          </article>
        ))}
      </div>
      <div
        className="pager"
        id="qa-pager"
        role="group"
        aria-label="Trang câu hỏi"
      >
        {Array.from({ length: Math.ceil(questions.length / 2) }, (_, index) => (
          <button
            key={index}
            aria-label={`Trang câu hỏi ${index + 1}`}
            aria-pressed={page === index}
            onClick={() => setPage(index)}
          />
        ))}
      </div>
    </>
  );
}
