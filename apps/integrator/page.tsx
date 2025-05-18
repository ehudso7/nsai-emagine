'use client';
import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';

// Define workflow templates
const workflowTemplates = [
  {
    id: 'blog-to-email',
    name: 'Blog to Email Campaign',
    description: 'When new blog post is published, create an email campaign',
    steps: [
      { id: 'trigger', type: 'trigger', tool: 'nichepress', action: 'publish' },
      { id: 'action1', type: 'action', tool: 'email', action: 'send' },
      { id: 'action2', type: 'action', tool: 'advisor', action: 'notify' }
    ]
  },
  {
    id: 'grant-apply',
    name: 'Grant Application Flow',
    description: 'When new grant is found, prepare application and notify',
    steps: [
      { id: 'trigger', type: 'trigger', tool: 'grantbot', action: 'found' },
      { id: 'action1', type: 'action', tool: 'grantbot', action: 'autofill' },
      { id: 'action2', type: 'action', tool: 'email', action: 'notify' }
    ]
  },
  {
    id: 'hostflow-review',
    name: 'Guest Checkout & Review',
    description: 'When guest checks out, request review and notify cleaning',
    steps: [
      { id: 'trigger', type: 'trigger', tool: 'hostflow', action: 'checkout' },
      { id: 'action1', type: 'action', tool: 'hostflow', action: 'clean-notify' },
      { id: 'action2', type: 'action', tool: 'hostflow', action: 'review-request' }
    ]
  }
];

export default function NSAIIntegrator() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeWorkflows, setActiveWorkflows] = useState([]);
  const [workflowName, setWorkflowName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setWorkflowName(`My ${template.name}`);
  };

  const handleCreateWorkflow = () => {
    // In a real app, this would save to the backend
    setIsCreating(true);
    setTimeout(() => {
      const newWorkflow = {
        id: `workflow-${Date.now()}`,
        name: workflowName,
        template: selectedTemplate.id,
        status: 'active',
        created: new Date().toISOString()
      };
      
      setActiveWorkflows([...activeWorkflows, newWorkflow]);
      setSelectedTemplate(null);
      setWorkflowName('');
      setIsCreating(false);
    }, 1000);
  };

  const handleDeleteWorkflow = (workflowId) => {
    setActiveWorkflows(activeWorkflows.filter(w => w.id !== workflowId));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">NSAI Integrator</h1>
      <p className="mb-6 text-muted-foreground">
        Connect your NSAI tools together to create automated workflows.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="font-bold text-lg mb-4">Workflow Templates</h2>
          <div className="space-y-4">
            {workflowTemplates.map(template => (
              <div 
                key={template.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'hover:border-gray-300'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          {selectedTemplate ? (
            <div className="border rounded-lg p-4">
              <h2 className="font-bold text-lg mb-4">Configure Workflow</h2>
              
              <div className="mb-4">
                <label htmlFor="workflow-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Workflow Name
                </label>
                <input
                  id="workflow-name"
                  type="text"
                  className="w-full p-2 border rounded"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  placeholder="Enter a name for this workflow"
                />
              </div>
              
              <h3 className="font-medium text-sm text-gray-700 mb-2">Workflow Steps:</h3>
              <div className="space-y-2 mb-4">
                {selectedTemplate.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center bg-gray-50 p-2 rounded">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">
                      {index + 1}
                    </div>
                    <div>
                      <span className="text-sm capitalize">{step.type}: </span>
                      <span className="text-sm font-medium capitalize">{step.tool} - {step.action}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={handleCreateWorkflow}
                  disabled={!workflowName || isCreating}
                >
                  {isCreating ? 'Creating...' : 'Create Workflow'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg p-4 h-full flex flex-col justify-center items-center text-center text-gray-500">
              <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p>Select a template to create a new workflow</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-bold text-lg mb-4">Your Active Workflows</h2>
        
        {activeWorkflows.length > 0 ? (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created</th>
                  <th className="relative py-3.5 pl-3 pr-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {activeWorkflows.map(workflow => {
                  const template = workflowTemplates.find(t => t.id === workflow.template);
                  return (
                    <tr key={workflow.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {workflow.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {template?.name || ''}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {workflow.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(workflow.created).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteWorkflow(workflow.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border">
            <p className="text-gray-500">You don't have any active workflows yet</p>
          </div>
        )}
      </div>
    </div>
  );
}