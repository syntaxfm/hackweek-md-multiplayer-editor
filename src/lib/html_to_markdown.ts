import { unified, type Processor } from 'unified';
import rehypeParse from 'rehype-parse';
import remarkStringify from 'remark-stringify';
import rehypeRemark from 'rehype-remark';

const processor: Processor = unified()
	.use(rehypeParse) // Parse HTML
	.use(rehypeRemark) // Convert HTML to Markdown AST
	.use(remarkStringify, {
		bullet: '*', // Use '*' for bullets
		listItemIndent: 'one' // Indent by one space
	}); // Stringify Markdown

export async function html_to_markdown(html: string) {
	const processed = await processor.process(html);
	return processed.value;
}
