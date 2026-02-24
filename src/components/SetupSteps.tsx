export default function SetupSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-4">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-4 group">
          <div className="flex flex-col items-center">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-xs font-bold font-mono text-white">
              {i + 1}
            </span>
            {i < steps.length - 1 && (
              <div className="w-px flex-1 bg-neutral-200 mt-2" />
            )}
          </div>
          <span
            className="text-sm leading-relaxed text-neutral-600 pt-1 [&_code]:rounded-md [&_code]:bg-neutral-100 [&_code]:px-2 [&_code]:py-0.5 [&_code]:text-xs [&_code]:font-mono [&_code]:text-[#1a1a1a] [&_code]:font-semibold"
            dangerouslySetInnerHTML={{
              __html: step.replace(/`([^`]+)`/g, '<code>$1</code>'),
            }}
          />
        </li>
      ))}
    </ol>
  );
}
