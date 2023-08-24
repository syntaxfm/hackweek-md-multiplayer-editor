export function parse_line_display(text: string) {
	let element = 'p';
	// Markdown parser, check to see if first character is a #, if so, then it's a header
	// If it's a header, then check to see if it's a h1, h2, h3, h4, h5, or h6
	const [leading_text, display_text] = splitLeadingNonTextCharacters(text);
	if (leading_text === '#') {
		element = 'h1';
	} else if (leading_text === '##') {
		element = 'h2';
	} else if (leading_text === '###') {
		element = 'h3';
	} else if (leading_text === '####') {
		element = 'h4';
	}

	return [element, display_text, leading_text];
	// Return element for wrapper and text without the leading characters
}

function splitLeadingNonTextCharacters(input: string): [string, string] {
	const regex = /^([#*]+)(.*)/;
	const matches = input.match(regex);

	if (matches) {
		const leadingNonTextChars = matches[1];
		const remainingString = matches[2];
		return [leadingNonTextChars, remainingString];
	} else {
		return ['', input];
	}
}
