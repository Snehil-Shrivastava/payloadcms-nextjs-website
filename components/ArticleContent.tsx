// @ts-expect-error random
const ArticleContent = ({ content }) => {
  // Assuming content is your Payload rich text field
  // You'll need to render it appropriately based on your Payload setup

  return (
    <div className="p-8 bg-white h-full overflow-y-auto prose prose-lg max-w-none">
      {/* Render your rich text here - this depends on your Payload configuration */}
      {/* For example, if using @payloadcms/richtext-lexical: */}
      {content}
    </div>
  );
};

export default ArticleContent;
