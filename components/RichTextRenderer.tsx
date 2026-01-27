import { JSX } from "react";

import Image from "next/image";
import { Media } from "@/payload-types";

/* ---------------- LEXICAL NODE RENDERER ---------------- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RenderLexicalNode = ({ node }: { node: any }) => {
  // Handle paragraph nodes
  if (node.type === "paragraph") {
    return (
      <p className="mb-4 text-base leading-relaxed">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {node.children?.map((child: any, i: number) => {
          if (child.type === "text") {
            let text = <span key={i}>{child.text}</span>;

            // Apply formatting
            if (child.format) {
              if (child.format & 1)
                text = <strong key={i}>{child.text}</strong>; // bold
              if (child.format & 2) text = <em key={i}>{child.text}</em>; // italic
              if (child.format & 8) text = <u key={i}>{child.text}</u>; // underline
            }

            return text;
          }
          if (child.type === "link") {
            return (
              <a
                key={i}
                href={child.fields.url}
                className="text-blue-600 hover:underline"
                target={child.fields.newTab ? "_blank" : undefined}
                rel={child.fields.newTab ? "noopener noreferrer" : undefined}
              >
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {child.children?.map((linkChild: any, j: number) => (
                  <span key={j}>{linkChild.text}</span>
                ))}
              </a>
            );
          }
          return null;
        })}
      </p>
    );
  }

  // Handle heading nodes
  if (node.type === "heading") {
    const HeadingTag = `${node.tag}` as keyof JSX.IntrinsicElements;
    const headingClasses: Record<string, string> = {
      h1: "text-4xl font-bold mb-4 mt-8",
      h2: "text-3xl font-bold mb-3 mt-6",
      h3: "text-2xl font-semibold mb-3 mt-5",
      h4: "text-xl font-semibold mb-2 mt-4",
      h5: "text-lg font-semibold mb-2 mt-3",
      h6: "text-base font-semibold mb-2 mt-3",
    };

    return (
      <HeadingTag className={headingClasses[node.tag] || ""}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {node.children?.map((child: any, i: number) => {
          if (child.type === "text") {
            return <span key={i}>{child.text}</span>;
          }
          return null;
        })}
      </HeadingTag>
    );
  }

  // Handle lists
  if (node.type === "list") {
    const ListTag = node.listType === "bullet" ? "ul" : "ol";
    const listClass = node.listType === "bullet" ? "list-disc" : "list-decimal";

    return (
      <ListTag className={`mb-4 ml-6 ${listClass}`}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {node.children?.map((listItem: any, i: number) => (
          <li key={i} className="mb-1">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {listItem.children?.map((itemChild: any, j: number) => (
              <RenderLexicalNode key={j} node={itemChild} />
            ))}
          </li>
        ))}
      </ListTag>
    );
  }

  // Handle block quotes
  if (node.type === "quote") {
    return (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {node.children?.map((child: any, i: number) => (
          <RenderLexicalNode key={i} node={child} />
        ))}
      </blockquote>
    );
  }

  // Handle code blocks
  if (node.type === "code") {
    return (
      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
        <code className="text-sm font-mono">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {node.children?.map((child: any, i: number) => (
            <span key={i}>{child.text}</span>
          ))}
        </code>
      </pre>
    );
  }

  // Handle upload nodes (images)
  if (node.type === "upload") {
    const media = node.value as Media;

    if (media?.url) {
      return (
        <div className="my-6 relative w-full h-100">
          <Image
            src={media.url}
            alt={media.alt || "Article image"}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      );
    }
  }

  // Handle horizontal rule
  if (node.type === "horizontalrule") {
    return <hr className="my-8 border-gray-300" />;
  }

  return null;
};

/* ---------------- RENDER FULL LEXICAL CONTENT (NORMAL TOP-TO-BOTTOM) ---------------- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RenderLexicalContent = ({ nodes }: { nodes: any }) => {
  if (!nodes) return null;

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {nodes.map((node: any, index: number) => (
        <RenderLexicalNode key={index} node={node} />
      ))}
    </>
  );
};

/* ---------------- BLOCK RENDERERS (FOR HORIZONTAL COLUMN LAYOUT) ---------------- */

// Content Column Block (for horizontal layout)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ContentColumnBlock = ({ block }: { block: any }) => {
  return (
    <div className="w-200 max-xl:w-120 shrink-0 flex flex-col">
      {block.heading && (
        <h3 className="text-2xl font-bold mb-4">{block.heading}</h3>
      )}
      <div className="text-base leading-relaxed">
        <RenderLexicalContent nodes={block.content?.root?.children || []} />
      </div>
    </div>
  );
};

// Image Block (for horizontal layout)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ImageBlockRenderer = ({ block }: { block: any }) => {
  const image = block.image as Media;

  return (
    <div className="w-200 max-xl:w-120 shrink-0 relative h-full">
      {image?.url && (
        <>
          <Image
            src={image.url}
            alt={block.caption || "Article image"}
            fill
            className="object-cover"
          />
          {block.caption && (
            <p className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-sm">
              {block.caption}
            </p>
          )}
        </>
      )}
    </div>
  );
};

// Video Block (for horizontal layout)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const VideoBlockRenderer = ({ block }: { block: any }) => {
  return (
    <div className="w-200 max-xl:w-120 shrink-0">
      <div className="relative w-full aspect-video">
        <iframe
          src={block.videoUrl}
          className="w-full h-full"
          allowFullScreen
        />
      </div>
      {block.caption && (
        <p className="text-sm text-gray-600 mt-2">{block.caption}</p>
      )}
    </div>
  );
};

/* ---------------- RENDER CONTENT AS COLUMNS (CHECKS FOR BLOCKS OR NORMAL CONTENT) ---------------- */

export const RenderContentAsColumns = ({
  contentBlocks,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contentBlocks: any[];
}) => {
  if (!contentBlocks || contentBlocks.length === 0) return null;

  // Check if the content has blocks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasBlocks = contentBlocks.some((block: any) => block.type === "block");

  if (hasBlocks) {
    // Render as blocks (horizontal columns)
    return (
      <>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {contentBlocks.map((block: any, index: number) => {
          if (block.type === "block") {
            if (block.fields.blockType === "contentColumn") {
              return <ContentColumnBlock key={index} block={block.fields} />;
            }
            if (block.fields.blockType === "imageBlock") {
              return <ImageBlockRenderer key={index} block={block.fields} />;
            }
            if (block.fields.blockType === "videoBlock") {
              return <VideoBlockRenderer key={index} block={block.fields} />;
            }
          }
          return null;
        })}
      </>
    );
  } else {
    // Render normal content as columns (each top-level node gets a column)
    return (
      <>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {contentBlocks.map((node: any, index: number) => {
          // Check if this node has meaningful content
          const hasContent = node.children?.length > 0 || node.value;

          if (!hasContent) return null;

          return (
            <div key={index} className="w-200 max-xl:w-120 shrink-0">
              <RenderLexicalNode node={node} />
            </div>
          );
        })}
      </>
    );
  }
};
