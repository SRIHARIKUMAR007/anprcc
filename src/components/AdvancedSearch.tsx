
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar as CalendarIcon, MapPin, Camera, Clock } from "lucide-react";
import { format } from "date-fns";
import { useSupabaseRealTimeData } from '@/hooks/useSupabaseRealTimeData';

const AdvancedSearch = () => {
  const [plateSearch, setPlateSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [cameraFilter, setCameraFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [confidenceMin, setConfidenceMin] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const { detections, cameras, isConnected } = useSupabaseRealTimeData();

  console.log('AdvancedSearch - Available detections:', detections.length);
  console.log('AdvancedSearch - Available cameras:', cameras.length);

  const handleSearch = () => {
    setIsSearching(true);
    setHasSearched(true);
    
    console.log('Starting search with filters:', {
      plateSearch,
      locationFilter,
      cameraFilter,
      statusFilter,
      confidenceMin,
      dateFrom,
      dateTo
    });
    
    // Filter detections based on search criteria
    let results = detections.filter(detection => {
      let matches = true;
      
      // Plate number filter
      if (plateSearch.trim()) {
        matches = matches && detection.plate_number.toLowerCase().includes(plateSearch.toLowerCase());
      }
      
      // Location filter
      if (locationFilter.trim()) {
        matches = matches && detection.location.toLowerCase().includes(locationFilter.toLowerCase());
      }
      
      // Camera filter
      if (cameraFilter && cameraFilter !== 'all') {
        matches = matches && detection.camera_id === cameraFilter;
      }
      
      // Status filter
      if (statusFilter && statusFilter !== 'all') {
        matches = matches && detection.status === statusFilter;
      }
      
      // Confidence filter
      if (confidenceMin && confidenceMin !== '') {
        matches = matches && detection.confidence >= parseInt(confidenceMin);
      }
      
      // Date range filter
      if (dateFrom || dateTo) {
        const detectionDate = new Date(detection.timestamp);
        if (dateFrom && detectionDate < dateFrom) matches = false;
        if (dateTo && detectionDate > dateTo) matches = false;
      }
      
      return matches;
    });
    
    console.log('Search completed. Found results:', results.length);
    setSearchResults(results);
    setIsSearching(false);
  };

  const clearFilters = () => {
    setPlateSearch('');
    setLocationFilter('');
    setCameraFilter('all');
    setStatusFilter('all');
    setDateFrom(undefined);
    setDateTo(undefined);
    setConfidenceMin('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'flagged': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'processing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  // Auto-search functionality - search when any filter changes and there's input
  const autoSearch = () => {
    if (plateSearch || locationFilter || cameraFilter !== 'all' || statusFilter !== 'all' || confidenceMin || dateFrom || dateTo) {
      handleSearch();
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Search className="w-5 h-5 mr-2" />
          Advanced Search & Filtering
          {isConnected && (
            <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
              LIVE
            </Badge>
          )}
        </CardTitle>
        <div className="text-sm text-slate-400">
          Total records available: {detections.length} | Cameras: {cameras.length}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="plate" className="text-slate-300">License Plate</Label>
            <Input
              id="plate"
              placeholder="Enter plate number..."
              value={plateSearch}
              onChange={(e) => setPlateSearch(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-slate-300">Location</Label>
            <Input
              id="location"
              placeholder="Enter location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Camera</Label>
            <Select value={cameraFilter} onValueChange={setCameraFilter}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue placeholder="Select camera..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Cameras</SelectItem>
                {cameras.map((camera) => (
                  <SelectItem key={camera.id} value={camera.camera_id}>
                    {camera.camera_id} - {camera.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="cleared">Cleared</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confidence" className="text-slate-300">Min Confidence (%)</Label>
            <Input
              id="confidence"
              type="number"
              placeholder="0-100"
              min="0"
              max="100"
              value={confidenceMin}
              onChange={(e) => setConfidenceMin(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Date Range</Label>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {dateFrom ? format(dateFrom, "MM/dd") : "From"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {dateTo ? format(dateTo, "MM/dd") : "To"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button onClick={handleSearch} disabled={isSearching} className="bg-blue-600 hover:bg-blue-700">
            <Search className="w-4 h-4 mr-2" />
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
          <Button onClick={autoSearch} variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-700">
            <Filter className="w-4 h-4 mr-2" />
            Auto Search
          </Button>
          <Button variant="outline" onClick={clearFilters} className="border-slate-600 text-slate-300 hover:bg-slate-700">
            <Filter className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        {/* Show all records button when no search has been performed */}
        {!hasSearched && detections.length > 0 && (
          <div className="text-center py-4">
            <Button 
              onClick={() => {
                setSearchResults(detections.slice(0, 20)); // Show first 20 records
                setHasSearched(true);
              }}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Show Recent Records ({detections.length} available)
            </Button>
          </div>
        )}

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Search Results</h3>
              <Badge variant="outline" className="text-blue-400 border-blue-500/30">
                {searchResults.length} matches found
              </Badge>
            </div>
            
            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No results found matching your search criteria.</p>
                <p className="text-sm mt-1">Try adjusting your filters or search terms.</p>
                <div className="text-xs mt-3 text-slate-500">
                  Available data: {detections.length} total detections
                </div>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {searchResults.map((result) => (
                  <div key={result.id} className="bg-slate-700/30 rounded-lg p-3 border border-slate-600 hover:bg-slate-600/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-white bg-slate-600 px-2 py-1 rounded text-sm font-bold">
                          {result.plate_number}
                        </span>
                        <Badge className={getStatusColor(result.status)}>
                          {result.status.toUpperCase()}
                        </Badge>
                        <span className="text-slate-300 text-sm">{result.confidence}% confidence</span>
                      </div>
                      <span className="text-slate-400 text-xs">
                        {new Date(result.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <div className="flex items-center">
                        <Camera className="w-3 h-3 mr-1" />
                        {result.camera_id}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {result.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {searchResults.length > 0 && (
              <div className="text-center text-slate-400 text-sm">
                Showing {searchResults.length} of {detections.length} total records
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedSearch;
