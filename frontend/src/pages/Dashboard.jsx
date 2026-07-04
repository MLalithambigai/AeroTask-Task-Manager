import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, addTask, updateTask, deleteTask, changeTaskStatus, setFilter, resetFilters } from '../store/taskSlice';
import { useToast } from '../context/ToastContext';
import Header from '../components/Header';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { Plus, Search, RefreshCw, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const { tasks, loading, page, pages, totalTasks, filters } = useSelector((state) => state.tasks);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState(filters.search);

  // Sync search input with filter search when filters get reset
  useEffect(() => {
    setSearchTerm(filters.search);
  }, [filters.search]);

  // Fetch tasks on filter change
  useEffect(() => {
    dispatch(fetchTasks(filters));
  }, [dispatch, filters]);

  // Debounce live searching
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm !== filters.search) {
        dispatch(setFilter({ search: searchTerm, page: 1 }));
      }
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, dispatch, filters.search]);

  const handleStatusFilterChange = (status) => {
    dispatch(setFilter({ status, page: 1 }));
  };

  const handlePriorityFilterChange = (priority) => {
    dispatch(setFilter({ priority, page: 1 }));
  };

  const handleSortChange = (e) => {
    dispatch(setFilter({ sortBy: e.target.value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) {
      dispatch(setFilter({ page: newPage }));
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (taskData) => {
    if (selectedTask) {
      dispatch(updateTask({ id: selectedTask._id, taskData })).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          showToast('Task updated successfully!', 'success');
          setIsModalOpen(false);
        } else {
          showToast(res.payload || 'Failed to update task', 'error');
        }
      });
    } else {
      dispatch(addTask(taskData)).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          showToast('Task created successfully!', 'success');
          setIsModalOpen(false);
        } else {
          showToast(res.payload || 'Failed to create task', 'error');
        }
      });
    }
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(id)).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          showToast('Task deleted successfully!', 'success');
        } else {
          showToast(res.payload || 'Failed to delete task', 'error');
        }
      });
    }
  };

  const handleStatusChange = (id, newStatus) => {
    dispatch(changeTaskStatus({ id, status: newStatus })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        showToast(
          `Task marked as ${newStatus === 'completed' ? 'completed' : 'pending'}`,
          'success'
        );
      } else {
        showToast(res.payload || 'Failed to update status', 'error');
      }
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    dispatch(resetFilters());
    showToast('Filters reset', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-12">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Page title and add button */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Your Tasks</h1>
            <p className="text-sm text-slate-400 mt-1">
              You have <span className="text-violet-400 font-semibold">{totalTasks}</span> tasks matching your criteria
            </p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-violet-550 hover:to-indigo-550 transition-all active:scale-95 cursor-pointer font-bold"
          >
            <Plus className="w-5 h-5" />
            Add New Task
          </button>
        </div>

        {/* Search & Filters */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5 mb-8 backdrop-blur-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or description..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950/40 pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-550 transition-all"
              />
              <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-500" />
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter */}
              <div className="flex rounded-xl bg-slate-950/60 p-1 border border-slate-800/80">
                {['all', 'pending', 'completed'].map((statusOption) => (
                  <button
                    key={statusOption}
                    onClick={() => handleStatusFilterChange(statusOption)}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      filters.status === statusOption
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {statusOption}
                  </button>
                ))}
              </div>

              {/* Priority Select */}
              <div className="relative">
                <select
                  value={filters.priority}
                  onChange={(e) => handlePriorityFilterChange(e.target.value)}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-xs font-semibold text-slate-350 focus:outline-none focus:ring-2 focus:ring-violet-550 transition-all cursor-pointer uppercase tracking-wider"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              {/* Sort Select */}
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={handleSortChange}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-xs font-semibold text-slate-350 focus:outline-none focus:ring-2 focus:ring-violet-550 transition-all cursor-pointer uppercase tracking-wider"
                >
                  <option value="createdAt:desc">Newest First</option>
                  <option value="dueDate:asc">Due Date (Soonest)</option>
                  <option value="dueDate:desc">Due Date (Latest)</option>
                  <option value="priority:desc">Priority (High-Low)</option>
                  <option value="title:asc">Title (A-Z)</option>
                </select>
              </div>

              {/* Reset Filter Button */}
              <button
                onClick={handleResetFilters}
                className="p-2.5 border border-slate-850 bg-slate-950/60 rounded-xl text-slate-450 hover:text-white hover:bg-slate-800 transition-colors"
                title="Reset Filters"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Task Cards Container */}
        {loading && tasks.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-44 rounded-2xl border border-slate-800 bg-slate-900/10 p-5 flex flex-col justify-between">
                <div>
                  <div className="h-4.5 bg-slate-800 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-slate-800 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-slate-800 rounded w-5/6 mb-2"></div>
                </div>
                <div className="h-4 bg-slate-800 rounded w-1/3 mt-4"></div>
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-3xl p-16 text-center bg-slate-900/5">
            <SlidersHorizontal className="w-12 h-12 text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-300">No tasks found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">
              We couldn't find any tasks matching your filters or search terms. Try modifying your criteria or create a new task.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-350 transition-all cursor-pointer font-bold"
            >
              <Plus className="w-4 h-4" /> Create a task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="p-2 border border-slate-800 bg-slate-900/40 hover:bg-slate-800 rounded-xl text-slate-450 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent active:scale-95 cursor-pointer shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold text-slate-450 select-none">
              Page <span className="text-white">{page}</span> of <span className="text-white">{pages}</span>
            </span>
            <button
              disabled={page === pages}
              onClick={() => handlePageChange(page + 1)}
              className="p-2 border border-slate-800 bg-slate-900/40 hover:bg-slate-800 rounded-xl text-slate-455 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent active:scale-95 cursor-pointer shrink-0"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        task={selectedTask}
      />
    </div>
  );
};

export default Dashboard;
